export type PreferredContactMethod = "PHONE" | "WHATSAPP" | "EMAIL";

export interface PublicInquirySubmission {
  customer_name: string;
  phone: string;
  email: string | null;
  preferred_contact_method: PreferredContactMethod;
  package_id: string | null;
  travel_date: string;
  traveler_count: number;
  duration_days: number;
  arrival_location: string;
  budget_amount: string | null;
  interests: string | null;
  hotel_required: boolean;
  transport_required: boolean;
  special_requests: string | null;
  privacy_consent: true;
}

export interface PublicInquiryConfirmation {
  id: string;
  reference: string;
  status: "NEW";
  created_at: string;
}

export interface InquiryFieldError {
  field: string;
  issue: string;
}

export class InquirySubmissionError extends Error {
  readonly fieldErrors: InquiryFieldError[];

  constructor(message: string, fieldErrors: InquiryFieldError[] = []) {
    super(message);
    this.name = "InquirySubmissionError";
    this.fieldErrors = fieldErrors;
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFieldErrors(value: unknown): value is InquiryFieldError[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.field === "string" &&
        typeof item.issue === "string",
    )
  );
}

export async function submitPublicInquiry(
  input: PublicInquirySubmission,
  idempotencyKey: string,
): Promise<PublicInquiryConfirmation> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });
  } catch {
    throw new InquirySubmissionError(
      "The inquiry could not be sent. Check your connection and try again.",
    );
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = isRecord(body) && isRecord(body.error) ? body.error : null;
    throw new InquirySubmissionError(
      typeof error?.message === "string"
        ? error.message
        : "The inquiry could not be submitted. Please try again.",
      isFieldErrors(error?.details) ? error.details : [],
    );
  }

  if (
    !isRecord(body) ||
    !isRecord(body.data) ||
    typeof body.data.id !== "string" ||
    typeof body.data.reference !== "string" ||
    body.data.status !== "NEW" ||
    typeof body.data.created_at !== "string" ||
    !isRecord(body.meta) ||
    typeof body.meta.privacy_notice_version !== "string"
  ) {
    throw new InquirySubmissionError(
      "The inquiry was sent, but its confirmation could not be read. Contact AMX before submitting again.",
    );
  }

  return {
    id: body.data.id,
    reference: body.data.reference,
    status: "NEW",
    created_at: body.data.created_at,
  };
}
