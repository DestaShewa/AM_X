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

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "PROVIDER_CHECKING"
  | "QUOTATION_SENT"
  | "AWAITING_CONFIRMATION"
  | "CONVERTED"
  | "DECLINED"
  | "CANCELLED"
  | "CLOSED";

export interface InquiryListItem {
  id: string;
  reference: string;
  status: InquiryStatus;
  customer_name: string;
  phone: string;
  travel_date: string;
  arrival_location: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryDetail extends InquiryListItem {
  email: string | null;
  preferred_contact_method: PreferredContactMethod;
  package_id: string | null;
  traveler_count: number;
  duration_days: number;
  budget_amount: string | null;
  budget_currency: string;
  interests: string | null;
  hotel_required: boolean;
  transport_required: boolean;
  special_requests: string | null;
  assigned_user_id: string | null;
  internal_notes: string | null;
  history: InquiryHistoryEntry[];
}

export interface InquiryHistoryEntry {
  action: string;
  user_id: string | null;
  change_summary: Record<string, unknown> | null;
  created_at: string;
}

export interface InquiryUpdate {
  status?: InquiryStatus;
  assigned_user_id?: string | null;
  internal_notes?: string | null;
}

export interface PublicInquiryRepository {
  create(
    input: PublicInquiryInput,
    idempotencyKey: string,
  ): Promise<{ inquiry: PublicInquiry; replayed: boolean }>;
  list?(page: number, pageSize: number, status?: InquiryStatus, search?: string): Promise<{
    items: InquiryListItem[];
    totalItems: number;
  }>;
  get?(id: string): Promise<InquiryDetail | null>;
  update?(id: string, input: InquiryUpdate, actorId: string): Promise<InquiryDetail | null>;
}

export class InvalidInquiryStatusTransitionError extends Error {
  constructor() {
    super("Invalid inquiry status transition");
    this.name = "InvalidInquiryStatusTransitionError";
  }
}

export class InvalidInquiryAssigneeError extends Error {
  constructor() {
    super("The selected staff member is unavailable");
    this.name = "InvalidInquiryAssigneeError";
  }
}

interface InquiryRow {
  id: string;
  reference: string;
  status: InquiryStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  preferred_contact_method: PreferredContactMethod;
  package_id: string | null;
  travel_date: Date;
  traveler_count: number;
  duration_days: number;
  arrival_location: string;
  budget_amount: string | null;
  budget_currency: string;
  interests: string | null;
  hotel_required: boolean;
  transport_required: boolean;
  special_requests: string | null;
  assigned_user_id: string | null;
  internal_notes: string | null;
  created_at: Date;
  updated_at: Date;
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

const INQUIRY_STATUS_TRANSITIONS: Record<InquiryStatus, readonly InquiryStatus[]> = {
  NEW: ["CONTACTED", "CANCELLED"],
  CONTACTED: ["PROVIDER_CHECKING", "CANCELLED", "CLOSED"],
  PROVIDER_CHECKING: ["QUOTATION_SENT", "CONTACTED", "CANCELLED"],
  QUOTATION_SENT: ["AWAITING_CONFIRMATION", "CANCELLED"],
  AWAITING_CONFIRMATION: ["CONVERTED", "DECLINED", "CANCELLED"],
  CONVERTED: ["CLOSED"],
  DECLINED: ["CLOSED"],
  CANCELLED: ["CLOSED"],
  CLOSED: [],
};

export function isInquiryStatusTransitionAllowed(
  current: InquiryStatus,
  next: InquiryStatus,
): boolean {
  return INQUIRY_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

export function isManualInquiryStatusTransitionAllowed(
  current: InquiryStatus,
  next: InquiryStatus,
): boolean {
  return next !== "CONVERTED" && isInquiryStatusTransitionAllowed(current, next);
}

function toPublicInquiry(row: InquiryRow): PublicInquiry {
  return {
    id: row.id,
    reference: row.reference,
    status: "NEW",
    created_at: row.created_at.toISOString(),
  };
}

function toInquiryListItem(row: InquiryRow): InquiryListItem {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    customer_name: row.customer_name,
    phone: row.phone,
    travel_date: localDateString(row.travel_date),
    arrival_location: row.arrival_location,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

function toInquiryDetail(
  row: InquiryRow,
  history: InquiryHistoryEntry[],
): InquiryDetail {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    customer_name: row.customer_name,
    phone: row.phone,
    email: row.email,
    preferred_contact_method: row.preferred_contact_method,
    package_id: row.package_id,
    travel_date: localDateString(row.travel_date),
    traveler_count: row.traveler_count,
    duration_days: row.duration_days,
    arrival_location: row.arrival_location,
    budget_amount: row.budget_amount?.toString() ?? null,
    budget_currency: row.budget_currency,
    interests: row.interests,
    hotel_required: row.hotel_required,
    transport_required: row.transport_required,
    special_requests: row.special_requests,
    assigned_user_id: row.assigned_user_id,
    internal_notes: row.internal_notes,
    history,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
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

    async list(page, pageSize, status, search) {
      const offset = (page - 1) * pageSize;
      const conditions: string[] = [];
      const values: unknown[] = [];
      if (status) {
        values.push(status);
        conditions.push(`i.status = $${values.length}`);
      }
      if (search) {
        values.push(`%${search}%`);
        const searchParameter = `$${values.length}`;
        conditions.push(
          `(i.reference ILIKE ${searchParameter}
            OR c.full_name ILIKE ${searchParameter}
            OR c.phone ILIKE ${searchParameter}
            OR c.email ILIKE ${searchParameter})`,
        );
      }
      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const pageSizeParameter = values.length + 1;
      const offsetParameter = values.length + 2;
      const queryValues = [...values, pageSize, offset];
      const [itemsResult, countResult] = await Promise.all([
        pool.query<InquiryRow>(
          `SELECT i.*, c.full_name AS customer_name, c.phone, c.email,
                  c.preferred_contact_method, c.whatsapp_number
           FROM inquiries i
           JOIN customers c ON c.id = i.customer_id
           ${where}
           ORDER BY i.updated_at DESC, i.id ASC
           LIMIT $${pageSizeParameter} OFFSET $${offsetParameter}`,
          queryValues,
        ),
        pool.query<{ total_items: number }>(
          `SELECT COUNT(*)::int AS total_items
           FROM inquiries i
           JOIN customers c ON c.id = i.customer_id
           ${where}`,
          values,
        ),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Inquiry count query returned no result");
      }
      return {
        items: itemsResult.rows.map(toInquiryListItem),
        totalItems,
      };
    },

    async get(id) {
      const result = await pool.query<InquiryRow>(
        `SELECT i.*, c.full_name AS customer_name, c.phone, c.email,
                c.preferred_contact_method, c.whatsapp_number
         FROM inquiries i
         JOIN customers c ON c.id = i.customer_id
         WHERE i.id = $1`,
        [id],
      );
      const row = result.rows[0];
      if (!row) {
        return null;
      }
      const historyResult = await pool.query<{
        action: string;
        user_id: string | null;
        change_summary: Record<string, unknown> | null;
        created_at: Date;
      }>(
        `SELECT action, user_id, change_summary, created_at
         FROM audit_logs
         WHERE entity_type = 'inquiry' AND entity_id = $1
         ORDER BY created_at DESC, id DESC`,
        [id],
      );
      return toInquiryDetail(
        row,
        historyResult.rows.map((entry) => ({
          action: entry.action,
          user_id: entry.user_id,
          change_summary: entry.change_summary,
          created_at: entry.created_at.toISOString(),
        })),
      );
    },

    async update(id, input, actorId) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const existing = await client.query<InquiryRow>(
          `SELECT i.*, c.full_name AS customer_name, c.phone, c.email,
                  c.preferred_contact_method, c.whatsapp_number
           FROM inquiries i
           JOIN customers c ON c.id = i.customer_id
           WHERE i.id = $1
           FOR UPDATE OF i`,
          [id],
        );
        const before = existing.rows[0];
        if (!before) {
          await client.query("COMMIT");
          return null;
        }

        const updates: { field: string; value: unknown }[] = [];
        if (input.status !== undefined) {
          if (!isManualInquiryStatusTransitionAllowed(before.status, input.status)) {
            throw new InvalidInquiryStatusTransitionError();
          }
          updates.push({ field: "status", value: input.status });
        }
        if (input.assigned_user_id !== undefined) {
          if (input.assigned_user_id !== null) {
            const assignee = await client.query<{ id: string }>(
              "SELECT id FROM users WHERE id = $1 AND status = 'ACTIVE' FOR SHARE",
              [input.assigned_user_id],
            );
            if (!assignee.rows[0]) {
              throw new InvalidInquiryAssigneeError();
            }
          }
          updates.push({ field: "assigned_user_id", value: input.assigned_user_id });
        }
        if (input.internal_notes !== undefined) {
          updates.push({ field: "internal_notes", value: input.internal_notes });
        }

        if (updates.length > 0) {
          const assignments = updates
            .map(({ field }, index) => `${field} = $${index + 1}`)
            .join(", ");
          const values = updates.map(({ value }) => value);
          await client.query(
            `UPDATE inquiries
             SET ${assignments}, updated_at = NOW()
             WHERE id = $${updates.length + 1}`,
            [...values, id],
          );
          await client.query(
            `INSERT INTO audit_logs
             (user_id, action, entity_type, entity_id, change_summary)
             VALUES ($1, $2, $3, $4, $5::jsonb)`,
            [
              actorId,
              "inquiry.updated",
              "inquiry",
              id,
              JSON.stringify({
                changed_fields: updates.map(({ field }) => field),
                from_status: before.status,
                to_status: input.status ?? before.status,
              }),
            ],
          );
        }

        const updated = await client.query<InquiryRow>(
          `SELECT i.*, c.full_name AS customer_name, c.phone, c.email,
                  c.preferred_contact_method, c.whatsapp_number
           FROM inquiries i
           JOIN customers c ON c.id = i.customer_id
           WHERE i.id = $1`,
          [id],
        );
        const updatedRow = updated.rows[0];
        if (!updatedRow) {
          throw new Error("Updated inquiry could not be retrieved");
        }
        const historyResult = await client.query<{
          action: string;
          user_id: string | null;
          change_summary: Record<string, unknown> | null;
          created_at: Date;
        }>(
          `SELECT action, user_id, change_summary, created_at
           FROM audit_logs
           WHERE entity_type = 'inquiry' AND entity_id = $1
           ORDER BY created_at DESC, id DESC`,
          [id],
        );
        await client.query("COMMIT");
        return toInquiryDetail(
          updatedRow,
          historyResult.rows.map((entry) => ({
            action: entry.action,
            user_id: entry.user_id,
            change_summary: entry.change_summary,
            created_at: entry.created_at.toISOString(),
          })),
        );
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
