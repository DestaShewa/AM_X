import {
  Router,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createRequireAuthentication, requireCsrf } from "../auth/routes.js";
import type { AuthRepository } from "../auth/repository.js";
import type {
  ManagementRepository,
  PackageInput,
  PackageStatus,
  PackageUpdate,
  ProviderAgreementStatus,
  ProviderInput,
  ProviderStatus,
  ProviderUpdate,
  ProviderVerificationStatus,
} from "./repository.js";
import { InvalidProviderAssignmentError } from "./repository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PACKAGE_STATUSES: readonly PackageStatus[] = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
];
const PROVIDER_STATUSES: readonly ProviderStatus[] = [
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
];
const VERIFICATION_STATUSES: readonly ProviderVerificationStatus[] = [
  "UNVERIFIED",
  "VERIFIED",
];
const AGREEMENT_STATUSES: readonly ProviderAgreementStatus[] = [
  "PENDING",
  "ACTIVE",
  "INACTIVE",
];

const packageFields = [
  "name",
  "slug",
  "description",
  "destination",
  "duration_days",
  "highlights",
  "itinerary",
  "inclusions",
  "exclusions",
  "important_information",
  "cancellation_terms",
  "base_price",
  "currency",
  "media_references",
  "provider_ids",
] as const;

const providerFields = [
  "name",
  "provider_type",
  "phone",
  "email",
  "location",
  "languages",
  "services_offered",
  "pricing_notes",
  "availability_notes",
  "license_details",
  "qualification_details",
  "agreement_status",
  "commission_terms",
  "notes",
] as const;

type ValidationResult<T> =
  | { value: T; error?: never }
  | { value?: never; error: string };

function isInvalid<T>(
  result: ValidationResult<T>,
): result is { value?: never; error: string } {
  return typeof result.error === "string";
}

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

function parsePositiveInteger(
  rawValue: unknown,
  defaultValue: number,
  maximum?: number,
): number | null {
  if (rawValue === undefined) {
    return defaultValue;
  }
  if (typeof rawValue !== "string" || !/^[1-9]\d*$/.test(rawValue)) {
    return null;
  }
  const value = Number(rawValue);
  if (
    !Number.isSafeInteger(value) ||
    (maximum !== undefined && value > maximum)
  ) {
    return null;
  }
  return value;
}

function getPagination(
  request: Request,
): ValidationResult<{ page: number; pageSize: number }> {
  const page = parsePositiveInteger(request.query.page, DEFAULT_PAGE);
  const pageSize = parsePositiveInteger(
    request.query.page_size,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const offset = page !== null && pageSize !== null ? (page - 1) * pageSize : NaN;
  if (
    page === null ||
    pageSize === null ||
    !Number.isSafeInteger(offset)
  ) {
    return { error: "Page must be positive and page_size must be between 1 and 100" };
  }
  return { value: { page, pageSize } };
}

function text(
  value: unknown,
  field: string,
  maximum: number,
  required: boolean,
): ValidationResult<string> {
  if (typeof value !== "string") {
    return { error: `${field} must be a string` };
  }
  const normalized = value.trim();
  if ((required && normalized.length === 0) || normalized.length > maximum) {
    return {
      error: `${field} must be ${required ? "non-empty and " : ""}at most ${maximum} characters`,
    };
  }
  return { value: normalized };
}

function nullableText(
  value: unknown,
  field: string,
  maximum: number,
): ValidationResult<string | null> {
  if (value === null) {
    return { value: null };
  }
  return text(value, field, maximum, false);
}

function stringList(value: unknown, field: string): ValidationResult<string[]> {
  if (
    !Array.isArray(value) ||
    value.length > 100 ||
    value.some(
      (item) =>
        typeof item !== "string" ||
        item.trim() === "" ||
        item.trim().length > 500,
    )
  ) {
    return { error: `${field} must be an array of up to 100 non-empty strings` };
  }
  return { value: value.map((item: string) => item.trim()) };
}

function rejectUnknownFields(
  body: Record<string, unknown>,
  allowedFields: readonly string[],
): string | null {
  const unknownField = Object.keys(body).find(
    (field) => !allowedFields.includes(field),
  );
  return unknownField ? `Unsupported field: ${unknownField}` : null;
}

function packageInput(
  rawBody: unknown,
  partial: false,
): ValidationResult<PackageInput>;
function packageInput(
  rawBody: unknown,
  partial: true,
): ValidationResult<PackageUpdate>;
function packageInput(
  rawBody: unknown,
  partial: boolean,
): ValidationResult<PackageInput | PackageUpdate> {
  if (!isRecord(rawBody)) {
    return { error: "Request body must be a JSON object" };
  }
  const unknownError = rejectUnknownFields(rawBody, packageFields);
  if (unknownError) {
    return { error: unknownError };
  }

  const result: Record<string, unknown> = {};
  const requiredFields = ["name", "slug", "description", "destination"];
  for (const field of requiredFields) {
    if (partial && !Object.hasOwn(rawBody, field)) {
      continue;
    }
    const limits: Record<string, number> = {
      name: 180,
      slug: 200,
      description: 10000,
      destination: 180,
    };
    const maximum = limits[field];
    if (maximum === undefined) {
      return { error: `Unsupported field: ${field}` };
    }
    const parsed = text(rawBody[field], field, maximum, true);
    if (isInvalid(parsed)) {
      return { error: parsed.error };
    }
    if (field === "slug" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsed.value)) {
      return { error: "slug must contain lowercase letters, numbers and hyphens" };
    }
    result[field] = parsed.value;
  }

  if (!partial || Object.hasOwn(rawBody, "duration_days")) {
    const duration = rawBody.duration_days;
    if (
      typeof duration !== "number" ||
      !Number.isSafeInteger(duration) ||
      duration < 1 ||
      duration > 2_147_483_647
    ) {
      return { error: "duration_days must be a positive integer" };
    }
    result.duration_days = duration;
  }

  const listFields = ["highlights", "itinerary", "inclusions", "exclusions"];
  for (const field of listFields) {
    if (!partial || Object.hasOwn(rawBody, field)) {
      const parsed = stringList(rawBody[field] ?? [], field);
      if (isInvalid(parsed)) {
        return { error: parsed.error };
      }
      result[field] = parsed.value;
    }
  }
  const nullableFields: Record<string, number> = {
    important_information: 10000,
    cancellation_terms: 10000,
  };
  for (const [field, maximum] of Object.entries(nullableFields)) {
    if (!partial || Object.hasOwn(rawBody, field)) {
      const parsed = nullableText(
        Object.hasOwn(rawBody, field) ? rawBody[field] : null,
        field,
        maximum,
      );
      if (isInvalid(parsed)) {
        return { error: parsed.error };
      }
      result[field] = parsed.value;
    }
  }
  if (!partial || Object.hasOwn(rawBody, "base_price")) {
    const price = Object.hasOwn(rawBody, "base_price")
      ? rawBody.base_price
      : null;
    if (price !== null && (typeof price !== "string" || !/^\d{1,10}(?:\.\d{1,2})?$/.test(price))) {
      return { error: "base_price must be null or a non-negative amount with at most two decimals" };
    }
    result.base_price = price;
  }
  if (!partial || Object.hasOwn(rawBody, "currency")) {
    const parsed = text(rawBody.currency ?? "ETB", "currency", 3, true);
    if (isInvalid(parsed) || !/^[A-Z]{3}$/.test(parsed.value)) {
      return { error: "currency must be a three-letter uppercase code" };
    }
    result.currency = parsed.value;
  }
  if (!partial || Object.hasOwn(rawBody, "media_references")) {
    const references = rawBody.media_references ?? [];
    if (
      !Array.isArray(references) ||
      references.length > 50 ||
      references.some((reference) => {
        if (!isRecord(reference)) {
          return true;
        }
        const altText = reference.alt_text;
        if (
          typeof reference.url !== "string" ||
          typeof altText !== "string" ||
          altText.trim() === "" ||
          altText.trim().length > 500
        ) {
          return true;
        }
        try {
          return new URL(reference.url).protocol !== "https:";
        } catch {
          return true;
        }
      })
    ) {
      return { error: "media_references must contain HTTPS URLs with non-empty alt text" };
    }
    result.media_references = references.map((reference) => ({
      url: new URL(reference.url).toString(),
      alt_text: reference.alt_text.trim(),
    }));
  }
  if (!partial || Object.hasOwn(rawBody, "provider_ids")) {
    const providerIds = rawBody.provider_ids ?? [];
    if (
      !Array.isArray(providerIds) ||
      providerIds.length > 100 ||
      providerIds.some((id) => typeof id !== "string" || !UUID_PATTERN.test(id)) ||
      new Set(providerIds).size !== providerIds.length
    ) {
      return { error: "provider_ids must be a list of unique provider identifiers" };
    }
    result.provider_ids = providerIds;
  }
  if (partial && Object.keys(result).length === 0) {
    return { error: "At least one supported field must be provided" };
  }
  return { value: result as PackageInput | PackageUpdate };
}

function providerInput(
  rawBody: unknown,
  partial: false,
): ValidationResult<ProviderInput>;
function providerInput(
  rawBody: unknown,
  partial: true,
): ValidationResult<ProviderUpdate>;
function providerInput(
  rawBody: unknown,
  partial: boolean,
): ValidationResult<ProviderInput | ProviderUpdate> {
  if (!isRecord(rawBody)) {
    return { error: "Request body must be a JSON object" };
  }
  const unknownError = rejectUnknownFields(rawBody, providerFields);
  if (unknownError) {
    return { error: unknownError };
  }
  const result: Record<string, unknown> = {};
  const required: Record<string, number> = {
    name: 180,
    provider_type: 40,
    phone: 30,
    location: 255,
  };
  for (const [field, maximum] of Object.entries(required)) {
    if (partial && !Object.hasOwn(rawBody, field)) {
      continue;
    }
    const parsed = text(rawBody[field], field, maximum, true);
    if (isInvalid(parsed)) {
      return { error: parsed.error };
    }
    result[field] = parsed.value;
  }
  if (!partial || Object.hasOwn(rawBody, "email")) {
    const parsed = nullableText(
      Object.hasOwn(rawBody, "email") ? rawBody.email : null,
      "email",
      255,
    );
    if (
      isInvalid(parsed) ||
      (parsed.value !== null &&
        parsed.value !== undefined &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.value))
    ) {
      return { error: "email must be null or a valid email address" };
    }
    result.email = parsed.value;
  }
  for (const field of ["languages", "services_offered"]) {
    if (!partial || Object.hasOwn(rawBody, field)) {
      const parsed = stringList(rawBody[field] ?? [], field);
      if (isInvalid(parsed)) {
        return { error: parsed.error };
      }
      result[field] = parsed.value;
    }
  }
  const nullableFields: Record<string, number> = {
    pricing_notes: 5000,
    availability_notes: 5000,
    license_details: 5000,
    qualification_details: 5000,
    commission_terms: 5000,
    notes: 10000,
  };
  for (const [field, maximum] of Object.entries(nullableFields)) {
    if (!partial || Object.hasOwn(rawBody, field)) {
      const parsed = nullableText(
        Object.hasOwn(rawBody, field) ? rawBody[field] : null,
        field,
        maximum,
      );
      if (isInvalid(parsed)) {
        return { error: parsed.error };
      }
      result[field] = parsed.value;
    }
  }
  if (!partial || Object.hasOwn(rawBody, "agreement_status")) {
    const status = rawBody.agreement_status ?? "PENDING";
    if (!AGREEMENT_STATUSES.includes(status as ProviderAgreementStatus)) {
      return { error: "agreement_status must be PENDING, ACTIVE, or INACTIVE" };
    }
    result.agreement_status = status;
  }
  if (partial && Object.keys(result).length === 0) {
    return { error: "At least one supported field must be provided" };
  }
  return { value: result as ProviderInput | ProviderUpdate };
}

function isPgUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function isProviderAssignmentError(error: unknown): boolean {
  return error instanceof InvalidProviderAssignmentError;
}

function requireAdministrator(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (request.session.user?.role !== "Administrator") {
    errorResponse(response, 403, "FORBIDDEN", "Administrator access is required");
    return;
  }
  next();
}

function isOneOf<T extends string>(
  value: unknown,
  values: readonly T[],
): value is T {
  return typeof value === "string" && values.some((candidate) => candidate === value);
}

function authenticatedActorId(
  request: Request,
  response: Response,
): string | null {
  const actorId = request.session.user?.id;
  if (!actorId) {
    errorResponse(response, 401, "AUTH_REQUIRED", "Authentication required");
    return null;
  }
  return actorId;
}

function sendPackagePage(
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

function sendManagementError(
  error: unknown,
  response: Response,
  next: (error?: unknown) => void,
): void {
  if (isPgUniqueViolation(error)) {
    errorResponse(response, 409, "CONFLICT", "A record with that identifier already exists");
    return;
  }
  if (isProviderAssignmentError(error)) {
    errorResponse(
      response,
      400,
      "INVALID_PROVIDER",
      "One or more assigned providers do not exist",
    );
    return;
  }
  next(error);
}

export function createManagementRouter({
  repository,
  authRepository,
}: {
  repository: ManagementRepository;
  authRepository: AuthRepository;
}): Router {
  const router = Router();
  const requireAuthentication = createRequireAuthentication(authRepository);
  const administrators: RequestHandler[] = [
    requireAuthentication,
    requireAdministrator,
  ];

  router.get("/packages", ...administrators, (request, response, next) => {
    const pagination = getPagination(request);
    if (isInvalid(pagination)) {
      errorResponse(response, 400, "INVALID_PAGINATION", pagination.error);
      return;
    }
    const { page, pageSize } = pagination.value;
    void repository
      .listPackages(page, pageSize)
      .then((result) => sendPackagePage(response, result, page, pageSize))
      .catch((error: unknown) => sendManagementError(error, response, next));
  });

  router.post("/packages", ...administrators, requireCsrf, (request, response, next) => {
    const parsed = packageInput(request.body, false);
    if (isInvalid(parsed)) {
      errorResponse(response, 400, "INVALID_REQUEST", parsed.error);
      return;
    }
    const actorId = authenticatedActorId(request, response);
    if (!actorId) {
      return;
    }
    void repository
      .createPackage(parsed.value, actorId)
      .then((value) => {
        response.status(201).setHeader("Cache-Control", "no-store").json({ data: value });
      })
      .catch((error: unknown) => sendManagementError(error, response, next));
  });

  router.get("/packages/:id", ...administrators, (request, response, next) => {
    const id = request.params.id;
    if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
      errorResponse(response, 404, "NOT_FOUND", "Package not found");
      return;
    }
    void repository.getPackage(id).then((value) => {
      if (!value) {
        errorResponse(response, 404, "NOT_FOUND", "Package not found");
        return;
      }
      response.setHeader("Cache-Control", "no-store").json({ data: value });
    }).catch((error: unknown) => sendManagementError(error, response, next));
  });

  router.patch(
    "/packages/:id",
    ...administrators,
    requireCsrf,
    (request, response, next) => {
      const id = request.params.id;
      if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
        errorResponse(response, 404, "NOT_FOUND", "Package not found");
        return;
      }
      const parsed = packageInput(request.body, true);
      if (isInvalid(parsed)) {
        errorResponse(response, 400, "INVALID_REQUEST", parsed.error);
        return;
      }
      const actorId = request.session.user?.id;
      if (!actorId) {
        errorResponse(response, 401, "AUTH_REQUIRED", "Authentication required");
        return;
      }
      void repository
        .updatePackage(id, parsed.value, actorId)
        .then((value) => {
          if (!value) {
            errorResponse(response, 404, "NOT_FOUND", "Package not found");
            return;
          }
          response.setHeader("Cache-Control", "no-store").json({ data: value });
        })
        .catch((error: unknown) => sendManagementError(error, response, next));
    },
  );

  router.patch(
    "/packages/:id/status",
    ...administrators,
    requireCsrf,
    (request, response, next) => {
      const id = request.params.id;
      const status = isRecord(request.body) ? request.body.status : undefined;
      if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
        errorResponse(response, 404, "NOT_FOUND", "Package not found");
        return;
      }
      if (!isOneOf(status, PACKAGE_STATUSES)) {
        errorResponse(response, 400, "INVALID_STATUS", "Unsupported package status");
        return;
      }
      const actorId = authenticatedActorId(request, response);
      if (!actorId) {
        return;
      }
      void repository
        .updatePackageStatus(id, status, actorId)
        .then((value) => {
          if (!value) {
            errorResponse(response, 404, "NOT_FOUND", "Package not found");
            return;
          }
          response.setHeader("Cache-Control", "no-store").json({ data: value });
        })
        .catch(next);
    },
  );

  router.get("/providers", ...administrators, (request, response, next) => {
    const pagination = getPagination(request);
    if (isInvalid(pagination)) {
      errorResponse(response, 400, "INVALID_PAGINATION", pagination.error);
      return;
    }
    const { page, pageSize } = pagination.value;
    void repository
      .listProviders(page, pageSize)
      .then((result) => sendPackagePage(response, result, page, pageSize))
      .catch((error: unknown) => sendManagementError(error, response, next));
  });

  router.post("/providers", ...administrators, requireCsrf, (request, response, next) => {
    const parsed = providerInput(request.body, false);
    if (isInvalid(parsed)) {
      errorResponse(response, 400, "INVALID_REQUEST", parsed.error);
      return;
    }
    const actorId = authenticatedActorId(request, response);
    if (!actorId) {
      return;
    }
    void repository
      .createProvider(parsed.value, actorId)
      .then((value) => {
        response.status(201).setHeader("Cache-Control", "no-store").json({ data: value });
      })
      .catch((error: unknown) => sendManagementError(error, response, next));
  });

  router.get("/providers/:id", ...administrators, (request, response, next) => {
    const id = request.params.id;
    if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
      errorResponse(response, 404, "NOT_FOUND", "Provider not found");
      return;
    }
    void repository.getProvider(id).then((value) => {
      if (!value) {
        errorResponse(response, 404, "NOT_FOUND", "Provider not found");
        return;
      }
      response.setHeader("Cache-Control", "no-store").json({ data: value });
    }).catch(next);
  });

  router.patch(
    "/providers/:id",
    ...administrators,
    requireCsrf,
    (request, response, next) => {
      const id = request.params.id;
      if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
        errorResponse(response, 404, "NOT_FOUND", "Provider not found");
        return;
      }
      const parsed = providerInput(request.body, true);
      if (isInvalid(parsed)) {
        errorResponse(response, 400, "INVALID_REQUEST", parsed.error);
        return;
      }
      const actorId = authenticatedActorId(request, response);
      if (!actorId) {
        return;
      }
      void repository
        .updateProvider(id, parsed.value, actorId)
        .then((value) => {
          if (!value) {
            errorResponse(response, 404, "NOT_FOUND", "Provider not found");
            return;
          }
          response.setHeader("Cache-Control", "no-store").json({ data: value });
        })
        .catch((error: unknown) => sendManagementError(error, response, next));
    },
  );

  router.patch(
    "/providers/:id/status",
    ...administrators,
    requireCsrf,
    (request, response, next) => {
      const id = request.params.id;
      const status = isRecord(request.body) ? request.body.status : undefined;
      if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
        errorResponse(response, 404, "NOT_FOUND", "Provider not found");
        return;
      }
      if (!isOneOf(status, PROVIDER_STATUSES)) {
        errorResponse(response, 400, "INVALID_STATUS", "Unsupported provider status");
        return;
      }
      const actorId = authenticatedActorId(request, response);
      if (!actorId) {
        return;
      }
      void repository
        .updateProviderStatus(id, status, actorId)
        .then((value) => {
          if (!value) {
            errorResponse(response, 404, "NOT_FOUND", "Provider not found");
            return;
          }
          response.setHeader("Cache-Control", "no-store").json({ data: value });
        })
        .catch(next);
    },
  );

  router.patch(
    "/providers/:id/verification",
    ...administrators,
    requireCsrf,
    (request, response, next) => {
      const id = request.params.id;
      const status = isRecord(request.body) ? request.body.status : undefined;
      if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
        errorResponse(response, 404, "NOT_FOUND", "Provider not found");
        return;
      }
      if (!isOneOf(status, VERIFICATION_STATUSES)) {
        errorResponse(response, 400, "INVALID_STATUS", "Unsupported verification status");
        return;
      }
      const actorId = authenticatedActorId(request, response);
      if (!actorId) {
        return;
      }
      void repository
        .updateProviderVerification(
          id,
          status,
          actorId,
        )
        .then((value) => {
          if (!value) {
            errorResponse(response, 404, "NOT_FOUND", "Provider not found");
            return;
          }
          response.setHeader("Cache-Control", "no-store").json({ data: value });
        })
        .catch(next);
    },
  );

  return router;
}
