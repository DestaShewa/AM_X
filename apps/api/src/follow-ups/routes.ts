import {
  Router,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createRequireAuthentication, requireCsrf } from "../auth/routes.js";
import type { AuthRepository } from "../auth/repository.js";
import {
  FollowUpIsClosedError,
  InvalidFollowUpAssigneeError,
  InvalidFollowUpTargetError,
  InvalidFollowUpTransitionError,
  type FollowUpDueFilter,
  type FollowUpInput,
  type FollowUpRepository,
  type FollowUpStatus,
  type FollowUpTargetType,
  type FollowUpUpdate,
} from "./repository.js";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FOLLOW_UP_STATUSES: readonly FollowUpStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];
const TARGET_TYPES: readonly FollowUpTargetType[] = ["CUSTOMER", "INQUIRY"];
const DUE_FILTERS: readonly FollowUpDueFilter[] = ["OVERDUE", "UPCOMING"];

type Validation<T> = { value: T } | { error: string };

function errorResponse(
  response: Response,
  status: number,
  code: string,
  message: string,
): void {
  response.status(status).json({ error: { code, message } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(
  value: unknown,
  choices: readonly T[],
): value is T {
  return typeof value === "string" && choices.includes(value as T);
}

function parsePagination(request: Request): Validation<{
  page: number;
  pageSize: number;
}> {
  const parse = (value: unknown, fallback: number, maximum?: number) => {
    if (value === undefined) return fallback;
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
    const number = Number(value);
    return Number.isSafeInteger(number) &&
      (maximum === undefined || number <= maximum)
      ? number
      : null;
  };
  const page = parse(request.query.page, 1);
  const pageSize = parse(request.query.page_size, PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX);
  if (
    page === null ||
    pageSize === null ||
    !Number.isSafeInteger((page - 1) * pageSize)
  ) {
    return { error: "Page must be positive and page_size must be between 1 and 100" };
  }
  return { value: { page, pageSize } };
}

function parseUuid(value: unknown, field: string): Validation<string> {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    return { error: `${field} must be a valid UUID` };
  }
  return { value };
}

function parseText(
  value: unknown,
  field: string,
  maximum: number,
  required: boolean,
): Validation<string> {
  if (typeof value !== "string") return { error: `${field} must be a string` };
  const normalized = value.trim();
  if ((required && normalized.length === 0) || normalized.length > maximum) {
    return {
      error: `${field} must be ${required ? "non-empty and " : ""}at most ${maximum} characters`,
    };
  }
  return { value: normalized };
}

function parseTimestamp(value: unknown, field: string): Validation<string> {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(
      value,
    ) ||
    Number.isNaN(Date.parse(value))
  ) {
    return { error: `${field} must be an ISO 8601 timestamp with a timezone` };
  }
  return { value: new Date(value).toISOString() };
}

function parseCreate(value: unknown): Validation<FollowUpInput> {
  if (!isRecord(value)) return { error: "Request body must be an object" };
  if (!isOneOf(value.target_type, TARGET_TYPES)) {
    return { error: "target_type must be CUSTOMER or INQUIRY" };
  }
  const targetId = parseUuid(value.target_id, "target_id");
  if ("error" in targetId) return targetId;
  const description = parseText(value.description, "description", 1000, true);
  if ("error" in description) return description;
  const dueAt = parseTimestamp(value.due_at, "due_at");
  if ("error" in dueAt) return dueAt;
  let assignedUserId: string | null = null;
  if (value.assigned_user_id !== undefined && value.assigned_user_id !== null) {
    const assignee = parseUuid(value.assigned_user_id, "assigned_user_id");
    if ("error" in assignee) return assignee;
    assignedUserId = assignee.value;
  }
  return {
    value: {
      target_type: value.target_type,
      target_id: targetId.value,
      description: description.value,
      due_at: dueAt.value,
      assigned_user_id: assignedUserId,
    },
  };
}

function parseUpdate(value: unknown): Validation<FollowUpUpdate> {
  if (!isRecord(value)) return { error: "Request body must be an object" };
  const update: FollowUpUpdate = {};
  if (Object.hasOwn(value, "description")) {
    const description = parseText(value.description, "description", 1000, true);
    if ("error" in description) return description;
    update.description = description.value;
  }
  if (Object.hasOwn(value, "due_at")) {
    const dueAt = parseTimestamp(value.due_at, "due_at");
    if ("error" in dueAt) return dueAt;
    update.due_at = dueAt.value;
  }
  if (Object.hasOwn(value, "assigned_user_id")) {
    if (value.assigned_user_id === null) {
      update.assigned_user_id = null;
    } else {
      const assignee = parseUuid(value.assigned_user_id, "assigned_user_id");
      if ("error" in assignee) return assignee;
      update.assigned_user_id = assignee.value;
    }
  }
  if (Object.keys(update).length === 0) {
    return { error: "At least one supported field must be provided" };
  }
  return { value: update };
}

function parseOutcomeNotes(value: unknown): Validation<string | null> {
  if (!isRecord(value)) return { error: "Request body must be an object" };
  if (value.outcome_notes === undefined || value.outcome_notes === null) {
    return { value: null };
  }
  const notes = parseText(value.outcome_notes, "outcome_notes", 4000, false);
  return "error" in notes ? notes : { value: notes.value || null };
}

function actorId(request: Request, response: Response): string | null {
  const id = request.session.user?.id;
  if (!id) {
    errorResponse(response, 401, "AUTH_REQUIRED", "Authentication required");
    return null;
  }
  return id;
}

function handleRepositoryError(
  error: unknown,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof InvalidFollowUpTargetError) {
    errorResponse(response, 400, "INVALID_TARGET", error.message);
    return;
  }
  if (error instanceof InvalidFollowUpAssigneeError) {
    errorResponse(response, 400, "INVALID_ASSIGNEE", error.message);
    return;
  }
  if (error instanceof InvalidFollowUpTransitionError) {
    errorResponse(response, 409, "INVALID_STATUS_TRANSITION", error.message);
    return;
  }
  if (error instanceof FollowUpIsClosedError) {
    errorResponse(response, 409, "FOLLOW_UP_CLOSED", error.message);
    return;
  }
  next(error);
}

function sendPage(
  response: Response,
  result: { items: unknown[]; totalItems: number },
  page: number,
  pageSize: number,
): void {
  response.setHeader("Cache-Control", "no-store");
  response.json({
    data: result.items,
    meta: {
      page,
      page_size: pageSize,
      total_items: result.totalItems,
      total_pages: Math.ceil(result.totalItems / pageSize),
    },
  });
}

export function createFollowUpRouter({
  repository,
  authRepository,
}: {
  repository: FollowUpRepository;
  authRepository: AuthRepository;
}): Router {
  const router = Router();
  const requireAuthentication = createRequireAuthentication(authRepository);
  const requireAdministrator: RequestHandler = (request, response, next) => {
    if (request.session.user?.role !== "Administrator") {
      errorResponse(response, 403, "FORBIDDEN", "Administrator access is required");
      return;
    }
    next();
  };
  const administrators = [requireAuthentication, requireAdministrator];

  router.get("/assignees", ...administrators, async (_request, response, next) => {
    try {
      const items = await repository.listAssignees();
      response.setHeader("Cache-Control", "no-store").json({ data: items });
    } catch (error) {
      next(error);
    }
  });

  router.get("/targets", ...administrators, async (request, response, next) => {
    const pagination = parsePagination(request);
    if ("error" in pagination) {
      errorResponse(response, 400, "INVALID_PAGINATION", pagination.error);
      return;
    }
    if (!isOneOf(request.query.type, TARGET_TYPES)) {
      errorResponse(response, 400, "INVALID_TARGET_TYPE", "Unsupported target type");
      return;
    }
    const search = request.query.search;
    if (search !== undefined && typeof search !== "string") {
      errorResponse(response, 400, "INVALID_SEARCH", "search must be a string");
      return;
    }
    if (typeof search === "string" && search.length > 100) {
      errorResponse(response, 400, "INVALID_SEARCH", "search must be at most 100 characters");
      return;
    }
    try {
      const result = await repository.listTargets(
        request.query.type,
        pagination.value.page,
        pagination.value.pageSize,
        typeof search === "string" ? search.trim() : undefined,
      );
      sendPage(response, result, pagination.value.page, pagination.value.pageSize);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", ...administrators, async (request, response, next) => {
    const pagination = parsePagination(request);
    if ("error" in pagination) {
      errorResponse(response, 400, "INVALID_PAGINATION", pagination.error);
      return;
    }
    const status = request.query.status;
    if (status !== undefined && !isOneOf(status, FOLLOW_UP_STATUSES)) {
      errorResponse(response, 400, "INVALID_STATUS", "Unsupported follow-up status");
      return;
    }
    const due = request.query.due;
    if (due !== undefined && !isOneOf(due, DUE_FILTERS)) {
      errorResponse(response, 400, "INVALID_DUE_FILTER", "Unsupported due filter");
      return;
    }
    const search = request.query.search;
    if (search !== undefined && typeof search !== "string") {
      errorResponse(response, 400, "INVALID_SEARCH", "search must be a string");
      return;
    }
    if (typeof search === "string" && search.length > 100) {
      errorResponse(response, 400, "INVALID_SEARCH", "search must be at most 100 characters");
      return;
    }
    try {
      const result = await repository.list(
        pagination.value.page,
        pagination.value.pageSize,
        isOneOf(status, FOLLOW_UP_STATUSES) ? status : undefined,
        isOneOf(due, DUE_FILTERS) ? due : undefined,
        typeof search === "string" ? search.trim() : undefined,
      );
      sendPage(response, result, pagination.value.page, pagination.value.pageSize);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    ...administrators,
    requireCsrf,
    async (request, response, next) => {
      const parsed = parseCreate(request.body);
      if ("error" in parsed) {
        errorResponse(response, 400, "INVALID_FOLLOW_UP", parsed.error);
        return;
      }
      const id = actorId(request, response);
      if (!id) return;
      try {
        const result = await repository.create(parsed.value, id);
        response.status(201).setHeader("Cache-Control", "no-store").json({
          data: result,
        });
      } catch (error) {
        handleRepositoryError(error, response, next);
      }
    },
  );

  router.get("/:id", ...administrators, async (request, response, next) => {
    const id = parseUuid(request.params.id, "id");
    if ("error" in id) {
      errorResponse(response, 400, "INVALID_ID", id.error);
      return;
    }
    try {
      const result = await repository.get(id.value);
      if (!result) {
        errorResponse(response, 404, "NOT_FOUND", "Follow-up not found");
        return;
      }
      response.setHeader("Cache-Control", "no-store").json({ data: result });
    } catch (error) {
      next(error);
    }
  });

  router.patch(
    "/:id",
    ...administrators,
    requireCsrf,
    async (request, response, next) => {
      const id = parseUuid(request.params.id, "id");
      if ("error" in id) {
        errorResponse(response, 400, "INVALID_ID", id.error);
        return;
      }
      const parsed = parseUpdate(request.body);
      if ("error" in parsed) {
        errorResponse(response, 400, "INVALID_FOLLOW_UP", parsed.error);
        return;
      }
      const actor = actorId(request, response);
      if (!actor) return;
      try {
        const result = await repository.update(id.value, parsed.value, actor);
        if (!result) {
          errorResponse(response, 404, "NOT_FOUND", "Follow-up not found");
          return;
        }
        response.setHeader("Cache-Control", "no-store").json({ data: result });
      } catch (error) {
        handleRepositoryError(error, response, next);
      }
    },
  );

  router.post(
    "/:id/start",
    ...administrators,
    requireCsrf,
    async (request, response, next) => {
      await transitionRoute(request, response, next, repository, "IN_PROGRESS");
    },
  );
  router.post(
    "/:id/complete",
    ...administrators,
    requireCsrf,
    async (request, response, next) => {
      const parsed = parseOutcomeNotes(request.body ?? {});
      if ("error" in parsed) {
        errorResponse(response, 400, "INVALID_FOLLOW_UP", parsed.error);
        return;
      }
      await transitionRoute(
        request,
        response,
        next,
        repository,
        "COMPLETED",
        parsed.value,
      );
    },
  );
  router.post(
    "/:id/cancel",
    ...administrators,
    requireCsrf,
    async (request, response, next) => {
      await transitionRoute(request, response, next, repository, "CANCELLED");
    },
  );
  return router;
}

async function transitionRoute(
  request: Request,
  response: Response,
  next: NextFunction,
  repository: FollowUpRepository,
  status: Extract<FollowUpStatus, "IN_PROGRESS" | "COMPLETED" | "CANCELLED">,
  outcomeNotes?: string | null,
): Promise<void> {
  const id = parseUuid(request.params.id, "id");
  if ("error" in id) {
    errorResponse(response, 400, "INVALID_ID", id.error);
    return;
  }
  const actor = actorId(request, response);
  if (!actor) return;
  try {
    const result = await repository.transition(
      id.value,
      status,
      actor,
      outcomeNotes,
    );
    if (!result) {
      errorResponse(response, 404, "NOT_FOUND", "Follow-up not found");
      return;
    }
    response.setHeader("Cache-Control", "no-store").json({ data: result });
  } catch (error) {
    handleRepositoryError(error, response, next);
  }
}
