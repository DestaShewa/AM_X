import pg from "pg";
import { loadConfig } from "../src/config.js";

interface Migration {
  name: string;
  run_on: Date;
}

const { Pool } = pg;
const config = loadConfig();
const pool = new Pool({ connectionString: config.databaseUrl });

try {
  const trackingTable = await pool.query<{ table_name: string | null }>(
    "SELECT to_regclass('public.pgmigrations')::text AS table_name",
  );

  if (!trackingTable.rows[0]?.table_name) {
    console.info(JSON.stringify({ initialized: false, applied: [] }));
  } else {
    const migrations = await pool.query<Migration>(
      "SELECT name, run_on FROM public.pgmigrations ORDER BY run_on, name",
    );
    console.info(
      JSON.stringify({
        initialized: true,
        applied: migrations.rows.map(({ name, run_on }) => ({
          name,
          run_on,
        })),
      }),
    );
  }
} finally {
  await pool.end();
}
