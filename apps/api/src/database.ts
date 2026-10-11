import pg from "pg";

const { Pool } = pg;

export function createDatabasePool(databaseUrl: string): pg.Pool {
  return new Pool({ connectionString: databaseUrl });
}
