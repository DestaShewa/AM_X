# Database setup and migrations

Local PostgreSQL is defined in the root `compose.yaml`. Start and stop it with:

```sh
docker compose up -d db
docker compose down
```

Schema changes are managed with `node-pg-migrate` through the root `db:up` and `db:down` scripts. These commands load the root `.env` file when it exists and use `DATABASE_URL`. The root `db:status` script reports migration tracking state and applied migrations.

The technical foundation intentionally contains no AMX domain migrations. Running `db:up` initializes the migration tool's tracking table; create domain migrations only after the relevant database and business rules are approved or formally deferred. Never edit a migration that has been applied to a shared or production database.

Local database data is held in a named Docker volume. `docker compose down -v` permanently removes that local volume and should only be used when intentionally resetting local data.
