import argon2 from "argon2";
import { input, password } from "@inquirer/prompts";
import type { PoolClient } from "pg";
import { createDatabasePool } from "../src/database.js";
import { loadConfig } from "../src/config.js";

async function createInitialAdministrator(): Promise<void> {
  const fullName = (
    await input({
      message: "Administrator full name",
      validate: (value) =>
        value.trim().length > 0 && value.trim().length <= 150
          ? true
          : "Enter a name of 1 to 150 characters.",
    })
  ).trim();

  const email = (
    await input({
      message: "Administrator email",
      validate: (value) =>
        value.trim().length <= 255 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? true
          : "Enter a valid email address.",
    })
  )
    .trim()
    .toLowerCase();

  const administratorPassword = await password({
    message: "Administrator password (minimum 12 characters)",
    validate: (value) =>
      value.length >= 12 ? true : "Use at least 12 characters.",
  });
  const confirmation = await password({
    message: "Confirm administrator password",
    validate: (value) =>
      value === administratorPassword ? true : "Passwords do not match.",
  });

  if (confirmation !== administratorPassword) {
    throw new Error("Administrator password confirmation failed.");
  }

  const config = loadConfig();
  const pool = createDatabasePool(config.databaseUrl);
  let client: PoolClient | undefined;
  let transactionStarted = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionStarted = true;
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('amx-initial-administrator-bootstrap')::bigint)",
    );
    const existingAdministrator = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1
         FROM users
         JOIN roles ON roles.id = users.role_id
         WHERE roles.name = 'Administrator'
       )`,
    );
    if (existingAdministrator.rows[0]?.exists) {
      throw new Error(
        "An Administrator already exists. Initial provisioning is one-time only.",
      );
    }

    const role = await client.query<{ id: string }>(
      `INSERT INTO roles (name, description)
       VALUES ('Administrator', 'Initial AMX system administrator')
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
    );
    const roleId = role.rows[0]?.id;
    if (!roleId) {
      throw new Error("Administrator role could not be created.");
    }
    const passwordHash = await argon2.hash(administratorPassword, {
      type: argon2.argon2id,
    });
    await client.query(
      `INSERT INTO users (role_id, full_name, email, password_hash, status)
       VALUES ($1, $2, $3, $4, 'ACTIVE')`,
      [roleId, fullName, email, passwordHash],
    );
    await client.query("COMMIT");
    transactionStarted = false;
    console.info(`Initial Administrator provisioned for ${email}.`);
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error(
          "Failed to roll back Administrator provisioning:",
          rollbackError instanceof Error ? rollbackError.message : "Unknown error",
        );
      }
    }
    throw error;
  } finally {
    client?.release();
    await pool.end();
  }
}

createInitialAdministrator().catch((error: unknown) => {
  console.error(
    "Administrator provisioning failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
});
