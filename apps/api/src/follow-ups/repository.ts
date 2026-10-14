import type { Pool, PoolClient } from "pg";

export type FollowUpTargetType = "CUSTOMER" | "INQUIRY";
export type FollowUpStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type FollowUpDueFilter = "OVERDUE" | "UPCOMING";

export interface FollowUpTargetOption {
  id: string;
  label: string;
  target_type: FollowUpTargetType;
}

export interface FollowUpAssigneeOption {
  id: string;
  full_name: string;
}

export interface FollowUpInput {
  target_type: FollowUpTargetType;
  target_id: string;
  assigned_user_id: string | null;
  description: string;
  due_at: string;
}

export type FollowUpUpdate = Partial<
  Pick<FollowUpInput, "assigned_user_id" | "description" | "due_at">
>;

export interface FollowUpHistoryEntry {
  action: string;
  user_id: string | null;
  change_summary: Record<string, unknown> | null;
  created_at: string;
}

export interface FollowUpListItem {
  id: string;
  target_type: FollowUpTargetType;
  target_id: string;
  target_label: string;
  customer_name: string;
  assigned_user_id: string | null;
  assigned_user_name: string | null;
  description: string;
  due_at: string;
  status: FollowUpStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUpDetail extends FollowUpListItem {
  outcome_notes: string | null;
  history: FollowUpHistoryEntry[];
}

export interface FollowUpRepository {
  list(
    page: number,
    pageSize: number,
    status?: FollowUpStatus,
    due?: FollowUpDueFilter,
    search?: string,
  ): Promise<{ items: FollowUpListItem[]; totalItems: number }>;
  listTargets(
    type: FollowUpTargetType,
    page: number,
    pageSize: number,
    search?: string,
  ): Promise<{ items: FollowUpTargetOption[]; totalItems: number }>;
  listAssignees(): Promise<FollowUpAssigneeOption[]>;
  get(id: string): Promise<FollowUpDetail | null>;
  create(input: FollowUpInput, actorId: string): Promise<FollowUpDetail>;
  update(
    id: string,
    input: FollowUpUpdate,
    actorId: string,
  ): Promise<FollowUpDetail | null>;
  transition(
    id: string,
    status: Extract<FollowUpStatus, "IN_PROGRESS" | "COMPLETED" | "CANCELLED">,
    actorId: string,
    outcomeNotes?: string | null,
  ): Promise<FollowUpDetail | null>;
}

export class InvalidFollowUpTargetError extends Error {
  constructor() {
    super("The selected customer or inquiry does not exist");
    this.name = "InvalidFollowUpTargetError";
  }
}

export class InvalidFollowUpAssigneeError extends Error {
  constructor() {
    super("The selected staff member is unavailable");
    this.name = "InvalidFollowUpAssigneeError";
  }
}

export class InvalidFollowUpTransitionError extends Error {
  constructor() {
    super("The follow-up cannot move to that status");
    this.name = "InvalidFollowUpTransitionError";
  }
}

export class FollowUpIsClosedError extends Error {
  constructor() {
    super("Completed or cancelled follow-ups cannot be changed");
    this.name = "FollowUpIsClosedError";
  }
}

type Queryable = Pick<PoolClient, "query">;

interface FollowUpRow {
  id: string;
  customer_id: string | null;
  inquiry_id: string | null;
  target_type: FollowUpTargetType;
  target_id: string;
  target_label: string;
  customer_name: string;
  assigned_user_id: string | null;
  assigned_user_name: string | null;
  description: string;
  due_at: Date;
  status: FollowUpStatus;
  completed_at: Date | null;
  outcome_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

const FOLLOW_UP_FIELDS = `
  f.id,
  f.customer_id,
  f.inquiry_id,
  CASE WHEN f.inquiry_id IS NOT NULL THEN 'INQUIRY' ELSE 'CUSTOMER' END AS target_type,
  COALESCE(f.inquiry_id, f.customer_id) AS target_id,
  CASE
    WHEN f.inquiry_id IS NOT NULL THEN i.reference || ' · ' || inquiry_customer.full_name
    ELSE direct_customer.full_name
  END AS target_label,
  COALESCE(inquiry_customer.full_name, direct_customer.full_name) AS customer_name,
  f.assigned_user_id,
  assigned_user.full_name AS assigned_user_name,
  f.description,
  f.due_at,
  f.status,
  f.completed_at,
  f.outcome_notes,
  f.created_at,
  f.updated_at`;

const FOLLOW_UP_JOINS = `
  FROM follow_ups f
  LEFT JOIN customers direct_customer ON direct_customer.id = f.customer_id
  LEFT JOIN inquiries i ON i.id = f.inquiry_id
  LEFT JOIN customers inquiry_customer ON inquiry_customer.id = i.customer_id
  LEFT JOIN users assigned_user ON assigned_user.id = f.assigned_user_id`;

const FOLLOW_UP_TRANSITIONS: Record<
  FollowUpStatus,
  readonly FollowUpStatus[]
> = {
  PENDING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function isFollowUpTransitionAllowed(
  current: FollowUpStatus,
  next: FollowUpStatus,
): boolean {
  return FOLLOW_UP_TRANSITIONS[current].includes(next);
}

function mapFollowUp(
  row: FollowUpRow,
  history: FollowUpHistoryEntry[] = [],
): FollowUpDetail {
  return {
    id: row.id,
    target_type: row.target_type,
    target_id: row.target_id,
    target_label: row.target_label,
    customer_name: row.customer_name,
    assigned_user_id: row.assigned_user_id,
    assigned_user_name: row.assigned_user_name,
    description: row.description,
    due_at: row.due_at.toISOString(),
    status: row.status,
    completed_at: row.completed_at?.toISOString() ?? null,
    outcome_notes: row.outcome_notes,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    history,
  };
}

async function writeAudit(
  client: PoolClient,
  actorId: string,
  action: string,
  id: string,
  summary: Record<string, unknown>,
): Promise<void> {
  await client.query(
    `INSERT INTO audit_logs
       (user_id, action, entity_type, entity_id, change_summary)
     VALUES ($1, $2, 'follow_up', $3, $4::jsonb)`,
    [actorId, action, id, JSON.stringify(summary)],
  );
}

async function followUpById(
  client: PoolClient,
  id: string,
): Promise<FollowUpRow | null> {
  const result = await client.query<FollowUpRow>(
    `SELECT ${FOLLOW_UP_FIELDS} ${FOLLOW_UP_JOINS} WHERE f.id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

async function followUpHistory(
  client: Queryable,
  id: string,
): Promise<FollowUpHistoryEntry[]> {
  const result = await client.query<{
    action: string;
    user_id: string | null;
    change_summary: Record<string, unknown> | null;
    created_at: Date;
  }>(
    `SELECT action, user_id, change_summary, created_at
     FROM audit_logs
     WHERE entity_type = 'follow_up' AND entity_id = $1
     ORDER BY created_at DESC, id DESC`,
    [id],
  );
  return result.rows.map((entry) => ({
    action: entry.action,
    user_id: entry.user_id,
    change_summary: entry.change_summary,
    created_at: entry.created_at.toISOString(),
  }));
}

function transaction<T>(
  pool: Pool,
  run: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await run(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  })();
}

export function createFollowUpRepository(pool: Pool): FollowUpRepository {
  async function validateAssignee(
    client: PoolClient,
    id: string | null,
  ): Promise<void> {
    if (id === null) return;
    const result = await client.query<{ id: string }>(
      "SELECT id FROM users WHERE id = $1 AND status = 'ACTIVE' FOR SHARE",
      [id],
    );
    if (!result.rows[0]) {
      throw new InvalidFollowUpAssigneeError();
    }
  }

  return {
    async list(page, pageSize, status, due, search) {
      const conditions: string[] = [];
      const values: unknown[] = [];
      if (status) {
        values.push(status);
        conditions.push(`f.status = $${values.length}`);
      }
      if (due === "OVERDUE") {
        conditions.push("f.status IN ('PENDING', 'IN_PROGRESS') AND f.due_at < NOW()");
      } else if (due === "UPCOMING") {
        conditions.push("f.status IN ('PENDING', 'IN_PROGRESS') AND f.due_at >= NOW()");
      }
      if (search) {
        values.push(`%${search}%`);
        const searchParameter = `$${values.length}`;
        conditions.push(
          `(f.description ILIKE ${searchParameter}
            OR i.reference ILIKE ${searchParameter})`,
        );
      }
      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const pageSizeParameter = values.length + 1;
      const offsetParameter = values.length + 2;
      const queryValues = [...values, pageSize, (page - 1) * pageSize];
      const [itemsResult, countResult] = await Promise.all([
        pool.query<FollowUpRow>(
          `SELECT ${FOLLOW_UP_FIELDS} ${FOLLOW_UP_JOINS}
           ${where}
           ORDER BY
             CASE WHEN f.status IN ('COMPLETED', 'CANCELLED') THEN 1 ELSE 0 END,
             f.due_at ASC,
             f.id ASC
           LIMIT $${pageSizeParameter} OFFSET $${offsetParameter}`,
          queryValues,
        ),
        pool.query<{ total_items: number }>(
          `SELECT COUNT(*)::int AS total_items ${FOLLOW_UP_JOINS} ${where}`,
          values,
        ),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Follow-up count query returned no result");
      }
      return {
        items: itemsResult.rows.map((row) => mapFollowUp(row)),
        totalItems,
      };
    },

    async listTargets(type, page, pageSize, search) {
      const offset = (page - 1) * pageSize;
      const values: unknown[] = [];
      const where = search
        ? (() => {
            values.push(`%${search}%`);
            return type === "CUSTOMER"
              ? "WHERE full_name ILIKE $1"
              : "WHERE (i.reference ILIKE $1 OR c.full_name ILIKE $1)";
          })()
        : "";
      const itemQuery =
        type === "CUSTOMER"
          ? `SELECT id, full_name AS label
             FROM customers ${where}
             ORDER BY updated_at DESC, id ASC
             LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
          : `SELECT i.id, i.reference || ' · ' || c.full_name AS label
             FROM inquiries i
             JOIN customers c ON c.id = i.customer_id
             ${where}
             ORDER BY i.updated_at DESC, i.id ASC
             LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      const countQuery =
        type === "CUSTOMER"
          ? `SELECT COUNT(*)::int AS total_items FROM customers ${where}`
          : `SELECT COUNT(*)::int AS total_items
             FROM inquiries i JOIN customers c ON c.id = i.customer_id ${where}`;
      const [itemsResult, countResult] = await Promise.all([
        pool.query<{ id: string; label: string }>(itemQuery, [
          ...values,
          pageSize,
          offset,
        ]),
        pool.query<{ total_items: number }>(countQuery, values),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Follow-up target count query returned no result");
      }
      return {
        items: itemsResult.rows.map((row) => ({
          id: row.id,
          label: row.label,
          target_type: type,
        })),
        totalItems,
      };
    },

    async listAssignees() {
      const result = await pool.query<FollowUpAssigneeOption>(
        `SELECT id, full_name
         FROM users
         WHERE status = 'ACTIVE'
         ORDER BY full_name ASC, id ASC`,
      );
      return result.rows;
    },

    async get(id) {
      const result = await pool.query<FollowUpRow>(
        `SELECT ${FOLLOW_UP_FIELDS} ${FOLLOW_UP_JOINS} WHERE f.id = $1`,
        [id],
      );
      const row = result.rows[0];
      if (!row) return null;
      const history = await followUpHistory(pool, id);
      return mapFollowUp(row, history);
    },

    async create(input, actorId) {
      return transaction(pool, async (client) => {
        await validateAssignee(client, input.assigned_user_id);
        const targetQuery =
          input.target_type === "CUSTOMER"
            ? "SELECT id FROM customers WHERE id = $1 FOR KEY SHARE"
            : "SELECT id FROM inquiries WHERE id = $1 FOR KEY SHARE";
        const target = await client.query<{ id: string }>(targetQuery, [
          input.target_id,
        ]);
        if (!target.rows[0]) {
          throw new InvalidFollowUpTargetError();
        }
        const inserted = await client.query<{ id: string }>(
          `INSERT INTO follow_ups
             (customer_id, inquiry_id, assigned_user_id, description, due_at, status)
           VALUES ($1, $2, $3, $4, $5::timestamptz, 'PENDING')
           RETURNING id`,
          [
            input.target_type === "CUSTOMER" ? input.target_id : null,
            input.target_type === "INQUIRY" ? input.target_id : null,
            input.assigned_user_id,
            input.description,
            input.due_at,
          ],
        );
        const id = inserted.rows[0]?.id;
        if (!id) throw new Error("Follow-up creation returned no identifier");
        await writeAudit(client, actorId, "follow_up.created", id, {
          changed_fields: [
            "target",
            "assigned_user_id",
            "description",
            "due_at",
            "status",
          ],
          status: "PENDING",
        });
        const row = await followUpById(client, id);
        if (!row) throw new Error("Created follow-up could not be retrieved");
        const history = await followUpHistory(client, id);
        return mapFollowUp(row, history);
      });
    },

    async update(id, input, actorId) {
      return transaction(pool, async (client) => {
        const existing = await client.query<FollowUpRow>(
          `SELECT ${FOLLOW_UP_FIELDS} ${FOLLOW_UP_JOINS}
           WHERE f.id = $1
           FOR UPDATE OF f`,
          [id],
        );
        const before = existing.rows[0];
        if (!before) return null;
        if (before.status === "COMPLETED" || before.status === "CANCELLED") {
          throw new FollowUpIsClosedError();
        }
        await validateAssignee(client, input.assigned_user_id ?? null);

        const columns: Record<keyof FollowUpUpdate, string> = {
          description: "description",
          due_at: "due_at",
          assigned_user_id: "assigned_user_id",
        };
        const entries = Object.entries(input) as [
          keyof FollowUpUpdate,
          FollowUpUpdate[keyof FollowUpUpdate],
        ][];
        if (entries.length > 0) {
          const assignments = entries.map(([field], index) => {
            const cast = field === "due_at" ? "::timestamptz" : "";
            return `${columns[field]} = $${index + 1}${cast}`;
          });
          await client.query(
            `UPDATE follow_ups
             SET ${assignments.join(", ")}, updated_at = NOW()
             WHERE id = $${entries.length + 1}`,
            [...entries.map(([, value]) => value), id],
          );
          await writeAudit(client, actorId, "follow_up.updated", id, {
            changed_fields: entries.map(([field]) => field),
          });
        }
        const row = await followUpById(client, id);
        if (!row) throw new Error("Updated follow-up could not be retrieved");
        return mapFollowUp(row, await followUpHistory(client, id));
      });
    },

    async transition(id, status, actorId, outcomeNotes) {
      return transaction(pool, async (client) => {
        const existing = await client.query<FollowUpRow>(
          `SELECT ${FOLLOW_UP_FIELDS} ${FOLLOW_UP_JOINS}
           WHERE f.id = $1
           FOR UPDATE OF f`,
          [id],
        );
        const before = existing.rows[0];
        if (!before) return null;
        if (!isFollowUpTransitionAllowed(before.status, status)) {
          throw new InvalidFollowUpTransitionError();
        }
        await client.query(
          `UPDATE follow_ups
           SET status = $1,
               completed_at = CASE WHEN $2 THEN NOW() ELSE NULL END,
               outcome_notes = CASE WHEN $2 THEN $3 ELSE outcome_notes END,
               updated_at = NOW()
           WHERE id = $4`,
          [status, status === "COMPLETED", outcomeNotes ?? null, id],
        );
        await writeAudit(client, actorId, `follow_up.${status.toLowerCase()}`, id, {
          changed_fields:
            status === "COMPLETED"
              ? ["status", "completed_at", "outcome_notes"]
              : ["status"],
          from_status: before.status,
          to_status: status,
        });
        const row = await followUpById(client, id);
        if (!row) throw new Error("Updated follow-up could not be retrieved");
        return mapFollowUp(row, await followUpHistory(client, id));
      });
    },
  };
}
