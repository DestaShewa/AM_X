import { Router, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import {
  IdempotencyPayloadConflictError,
  PUBLIC_PRIVACY_NOTICE_VERSION,
  UnavailablePackageError,
  type PreferredContactMethod,
  type PublicInquiryInput,
  type PublicInquiryRepository,
} from "./repository.js";

const IDEMPOTENCY_KEY_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTACT_METHODS: readonly PreferredContactMethod[] = [
  "PHONE",
  "WHATSAPP",
  "EMAIL",
];
const ALLOWED_FIELDS = [
  "customer_name",
  "phone",
  "email",
  "preferred_contact_method",
  "package_id",
  "travel_date",
  "traveler_count",
  "duration_days",
  "arrival_location",
  "budget_amount",
  "interests",
  "hotel_required",
  "transport_required",
  "special_requests",
  "privacy_consent",
] as const;

interface FieldError {
  field: string;
  issue: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addTextError(
  body: Record<string, unknown>,
  field: string,
  maximum: number,
  required: boolean,
  errors: FieldError[],
): string | null {
  const value = body[field];
  if (typeof value !== "string") {
    errors.push({ field, issue: "Enter text for this field." });
    return null;
  }
  const normalized = value.trim();
  if (normalized.length > maximum || (required && normalized.length === 0)) {
    errors.push({
      field,
      issue: required
        ? `Enter a value of at most ${maximum} characters.`
        : `Use at most ${maximum} characters.`,
    });
    return null;
  }
  return normalized;
}

function addNullableTextError(
  body: Record<string, unknown>,
  field: string,
  maximum: number,
  errors: FieldError[],
): string | null | undefined {
  if (!Object.hasOwn(body, field) || body[field] === null) {
    return null;
  }
  const value = addTextError(body, field, maximum, false, errors);
  return value?.length ? value : null;
}

function isOneOf<T extends string>(
  value: unknown,
  options: readonly T[],
): value is T {
  return typeof value === "string" && options.some((option) => option === value);
}

function addPositiveIntegerError(
  body: Record<string, unknown>,
  field: string,
  errors: FieldError[],
): number | null {
  const value = body[field];
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > 2_147_483_647
  ) {
    errors.push({ field, issue: "Enter a positive whole number." });
    return null;
  }
  return value;
}

function addDateError(
  value: unknown,
  errors: FieldError[],
): string | null {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ||
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value
  ) {
    errors.push({ field: "travel_date", issue: "Enter a valid travel date." });
    return null;
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const today = `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
  if (value <= today) {
    errors.push({ field: "travel_date", issue: "Choose a future travel date." });
    return null;
  }
  return value;
}

function parseInput(
  rawBody: unknown,
):
  | { valid: true; input: PublicInquiryInput }
  | { valid: false; errors: FieldError[] } {
  if (!isRecord(rawBody)) {
    return {
      valid: false,
      errors: [{ field: "body", issue: "Submit the inquiry as a JSON object." }],
    };
  }

  const errors: FieldError[] = [];
  for (const field of Object.keys(rawBody)) {
    if (!ALLOWED_FIELDS.includes(field as (typeof ALLOWED_FIELDS)[number])) {
      errors.push({ field, issue: "This field is not supported." });
    }
  }

  const customerName = addTextError(rawBody, "customer_name", 150, true, errors);
  const phone = addTextError(rawBody, "phone", 30, true, errors);
  if (phone && (!/^[+0-9().\s-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7)) {
    errors.push({ field: "phone", issue: "Enter a valid phone number." });
  }
  const email = addNullableTextError(rawBody, "email", 255, errors);
  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push({ field: "email", issue: "Enter a valid email address." });
  }

  const preferredContactMethod = rawBody.preferred_contact_method;
  if (!isOneOf(preferredContactMethod, CONTACT_METHODS)) {
    errors.push({
      field: "preferred_contact_method",
      issue: "Choose phone, WhatsApp, or email.",
    });
  } else if (preferredContactMethod === "EMAIL" && !email) {
    errors.push({
      field: "email",
      issue: "Enter an email address when email is your preferred contact method.",
    });
  }

  let packageId: string | null = null;
  if (rawBody.package_id !== undefined && rawBody.package_id !== null) {
    if (
      typeof rawBody.package_id !== "string" ||
      !IDEMPOTENCY_KEY_PATTERN.test(rawBody.package_id)
    ) {
      errors.push({ field: "package_id", issue: "The selected experience is invalid." });
    } else {
      packageId = rawBody.package_id;
    }
  }

  const travelDate = addDateError(rawBody.travel_date, errors);
  const travelerCount = addPositiveIntegerError(
    rawBody,
    "traveler_count",
    errors,
  );
  const durationDays = addPositiveIntegerError(rawBody, "duration_days", errors);
  const arrivalLocation = addTextError(
    rawBody,
    "arrival_location",
    255,
    true,
    errors,
  );
  let budgetAmount: string | null = null;
  if (rawBody.budget_amount !== undefined && rawBody.budget_amount !== null) {
    if (
      typeof rawBody.budget_amount !== "string" ||
      !/^\d{1,10}(?:\.\d{1,2})?$/.test(rawBody.budget_amount)
    ) {
      errors.push({
        field: "budget_amount",
        issue: "Enter a non-negative amount with at most two decimal places.",
      });
    } else {
      budgetAmount = rawBody.budget_amount;
    }
  }
  const interests = addNullableTextError(rawBody, "interests", 5000, errors);
  const specialRequests = addNullableTextError(
    rawBody,
    "special_requests",
    10000,
    errors,
  );
  const hotelRequired = rawBody.hotel_required;
  if (typeof hotelRequired !== "boolean") {
    errors.push({ field: "hotel_required", issue: "Choose yes or no." });
  }
  const transportRequired = rawBody.transport_required;
  if (typeof transportRequired !== "boolean") {
    errors.push({ field: "transport_required", issue: "Choose yes or no." });
  }
  if (rawBody.privacy_consent !== true) {
    errors.push({
      field: "privacy_consent",
      issue: "Consent is required to submit this inquiry.",
    });
  }

  if (
    errors.length > 0 ||
    customerName === null ||
    phone === null ||
    !isOneOf(preferredContactMethod, CONTACT_METHODS) ||
    travelDate === null ||
    travelerCount === null ||
    durationDays === null ||
    arrivalLocation === null ||
    typeof hotelRequired !== "boolean" ||
    typeof transportRequired !== "boolean"
  ) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    input: {
      customer_name: customerName,
      phone,
      email: email?.toLowerCase() ?? null,
      preferred_contact_method: preferredContactMethod,
      package_id: packageId,
      travel_date: travelDate,
      traveler_count: travelerCount,
      duration_days: durationDays,
      arrival_location: arrivalLocation,
      budget_amount: budgetAmount,
      interests: interests ?? null,
      hotel_required: hotelRequired,
      transport_required: transportRequired,
      special_requests: specialRequests ?? null,
      privacy_consent: true,
    },
  };
}

function sendValidationError(response: Response, errors: FieldError[]): void {
  response.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Please correct the highlighted fields and try again.",
      details: errors,
    },
  });
}

export function createPublicInquiryRouter(
  repository: PublicInquiryRepository,
): Router {
  const router = Router();
  const submissionLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(_request, response) {
      response.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many inquiries were submitted. Please try again later.",
        },
      });
    },
  });

  router.post("/", submissionLimit, (request: Request, response, next) => {
    const idempotencyKey = request.get("Idempotency-Key");
    if (!idempotencyKey || !IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
      sendValidationError(response, [
        {
          field: "Idempotency-Key",
          issue: "A valid idempotency key is required.",
        },
      ]);
      return;
    }
    const parsed = parseInput(request.body);
    if (!parsed.valid) {
      sendValidationError(response, parsed.errors);
      return;
    }
    void repository
      .create(parsed.input, idempotencyKey)
      .then(({ inquiry, replayed }) => {
        response.setHeader("Cache-Control", "no-store");
        response.status(replayed ? 200 : 201).json({
          data: inquiry,
          meta: {
            replayed,
            privacy_notice_version: PUBLIC_PRIVACY_NOTICE_VERSION,
          },
        });
      })
      .catch((error: unknown) => {
        if (error instanceof IdempotencyPayloadConflictError) {
          response.status(409).json({
            error: {
              code: "IDEMPOTENCY_CONFLICT",
              message:
                "This submission key was already used for different inquiry details.",
            },
          });
          return;
        }
        if (error instanceof UnavailablePackageError) {
          response.status(400).json({
            error: {
              code: "PACKAGE_UNAVAILABLE",
              message:
                "The selected experience is no longer available. Refresh and try again.",
            },
          });
          return;
        }
        next(error);
      });
  });

  return router;
}
