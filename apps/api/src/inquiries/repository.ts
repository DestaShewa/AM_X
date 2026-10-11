import { createHash, randomUUID } from "node:crypto";
import type { Pool } from "pg";

export const PUBLIC_PRIVACY_NOTICE_VERSION = "2026-10-11-v1";

export type PreferredContactMethod = "PHONE" | "WHATSAPP" | "EMAIL";

export interface PublicInquiryInput {
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

export interface PublicInquiry {
  id: string;
  reference: string;
  status: "NEW";
  created_at: string;
}

export interface PublicInquiryRepository {
  create(
    input: PublicInquiryInput,
    idempotencyKey: string,
  ): Promise<{ inquiry: PublicInquiry; replayed: boolean }>;
}

interface InquiryRow {
  id: string;
  reference: string;
  status: "NEW";
  created_at: Date;
  request_hash: string;
}

export class IdempotencyPayloadConflictError extends Error {
  constructor() {
    super("The idempotency key was already used with different inquiry details");
    this.name = "IdempotencyPayloadConflictError";
  }
}

export class UnavailablePackageError extends Error {
  constructor() {
    super("The selected experience is no longer available");
    this.name = "UnavailablePackageError";
  }
}

function toPublicInquiry(row: InquiryRow): PublicInquiry {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    created_at: row.created_at.toISOString(),
  };
}

function requestHash(input: PublicInquiryInput): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function localDateString(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function createReference(): string {
  const date = localDateString(new Date()).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  return `INQ-${date}-${suffix}`;
}

export function createPublicInquiryRepository(
  pool: Pool,
): PublicInquiryRepository {
  return {
    async create(input, idempotencyKey) {
      const hash = requestHash(input);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
          [idempotencyKey],
        );
        const existingResult = await client.query<InquiryRow>(
          `SELECT id, reference, status, created_at, request_hash
           FROM inquiries
           WHERE idempotency_key = $1`,
          [idempotencyKey],
        );
        const existing = existingResult.rows[0];
        if (existing) {
          if (existing.request_hash.trim() !== hash) {
            throw new IdempotencyPayloadConflictError();
          }
          await client.query("COMMIT");
          return { inquiry: toPublicInquiry(existing), replayed: true };
        }

        if (input.package_id) {
          const packageResult = await client.query<{ id: string }>(
            "SELECT id FROM packages WHERE id = $1 AND status = 'ACTIVE' FOR SHARE",
            [input.package_id],
          );
          if (packageResult.rows.length === 0) {
            throw new UnavailablePackageError();
          }
        }

        const customerResult = await client.query<{ id: string }>(
          `INSERT INTO customers
             (full_name, phone, whatsapp_number, email, preferred_contact_method)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            input.customer_name,
            input.phone,
            input.preferred_contact_method === "WHATSAPP" ? input.phone : null,
            input.email,
            input.preferred_contact_method,
          ],
        );
        const customerId = customerResult.rows[0]?.id;
        if (!customerId) {
          throw new Error("Inquiry customer creation returned no identifier");
        }

        const reference = createReference();
        const inquiryResult = await client.query<InquiryRow>(
          `INSERT INTO inquiries
             (reference, customer_id, package_id, travel_date, traveler_count,
              arrival_location, duration_days, budget_amount, budget_currency,
              interests, hotel_required, transport_required, special_requests,
              status, idempotency_key, request_hash, privacy_consent_at,
              privacy_notice_version)
           VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, 'ETB', $9, $10, $11,
                   $12, 'NEW', $13, $14, NOW(), $15)
           RETURNING id, reference, status, created_at, request_hash`,
          [
            reference,
            customerId,
            input.package_id,
            input.travel_date,
            input.traveler_count,
            input.arrival_location,
            input.duration_days,
            input.budget_amount,
            input.interests,
            input.hotel_required,
            input.transport_required,
            input.special_requests,
            idempotencyKey,
            hash,
            PUBLIC_PRIVACY_NOTICE_VERSION,
          ],
        );
        const row = inquiryResult.rows[0];
        if (!row) {
          throw new Error("Inquiry creation returned no record");
        }
        await client.query(
          `INSERT INTO audit_logs
             (action, entity_type, entity_id, change_summary, correlation_id)
           VALUES ('inquiry.submitted', 'inquiry', $1, $2::jsonb, $3)`,
          [
            row.id,
            JSON.stringify({
              source: "public_form",
              changed_fields: [
                "customer",
                "package_id",
                "travel_date",
                "traveler_count",
                "arrival_location",
                "duration_days",
                "budget_amount",
                "interests",
                "hotel_required",
                "transport_required",
                "special_requests",
              ],
            }),
            idempotencyKey,
          ],
        );
        await client.query("COMMIT");
        return { inquiry: toPublicInquiry(row), replayed: false };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
