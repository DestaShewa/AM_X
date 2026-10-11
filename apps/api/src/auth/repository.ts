import type { Pool } from "pg";
import type { AuthenticatedUser } from "./session.js";

export interface StaffCredential extends AuthenticatedUser {
  passwordHash: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface AuthRepository {
  findByEmail(email: string): Promise<StaffCredential | null>;
  findActiveById(id: string): Promise<AuthenticatedUser | null>;
  recordLogin(id: string): Promise<void>;
}

interface StaffRow {
  id: string;
  full_name: string;
  email: string;
  role_name: string;
  permissions: Record<string, unknown>;
  password_hash?: string;
  status: "ACTIVE" | "INACTIVE";
}

function mapUser(row: StaffRow): AuthenticatedUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role_name,
    permissions: row.permissions,
  };
}

export function createAuthRepository(pool: Pool): AuthRepository {
  return {
    async findByEmail(email) {
      const result = await pool.query<StaffRow>(
        `SELECT users.id, users.full_name, users.email, users.password_hash,
                users.status, roles.name AS role_name, roles.permissions
         FROM users
         JOIN roles ON roles.id = users.role_id
         WHERE users.email = $1`,
        [email],
      );
      const row = result.rows[0];
      if (!row) {
        return null;
      }
      if (!row.password_hash) {
        throw new Error("Staff credential record is missing its password hash");
      }
      return {
        ...mapUser(row),
        passwordHash: row.password_hash,
        status: row.status,
      };
    },

    async findActiveById(id) {
      const result = await pool.query<StaffRow>(
        `SELECT users.id, users.full_name, users.email,
                roles.name AS role_name, roles.permissions, users.status
         FROM users
         JOIN roles ON roles.id = users.role_id
         WHERE users.id = $1 AND users.status = 'ACTIVE'`,
        [id],
      );
      const row = result.rows[0];
      return row ? mapUser(row) : null;
    },

    async recordLogin(id) {
      await pool.query(
        "UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1",
        [id],
      );
    },
  };
}
