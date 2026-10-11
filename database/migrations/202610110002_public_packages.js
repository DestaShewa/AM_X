export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("packages", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(180)", notNull: true },
    slug: { type: "varchar(200)", notNull: true, unique: true },
    description: { type: "text", notNull: true },
    destination: { type: "varchar(180)", notNull: true },
    duration_days: { type: "integer", notNull: true },
    highlights: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    itinerary: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    inclusions: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    exclusions: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    important_information: { type: "text" },
    cancellation_terms: { type: "text" },
    base_price: { type: "numeric(12,2)" },
    currency: {
      type: "char(3)",
      notNull: true,
      default: "ETB",
    },
    media_references: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "DRAFT",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.addConstraint("packages", "packages_status_check", {
    check: "status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')",
  });
  pgm.addConstraint("packages", "packages_duration_positive_check", {
    check: "duration_days > 0",
  });
  pgm.addConstraint("packages", "packages_base_price_nonnegative_check", {
    check: "base_price IS NULL OR base_price >= 0",
  });
  for (const column of [
    "highlights",
    "itinerary",
    "inclusions",
    "exclusions",
    "media_references",
  ]) {
    pgm.addConstraint("packages", `packages_${column}_array_check`, {
      check: `jsonb_typeof(${column}) = 'array'`,
    });
  }
  pgm.createIndex("packages", ["status", "name", "slug"], {
    name: "packages_public_listing_idx",
  });
}

export async function down(pgm) {
  pgm.dropTable("packages");
}
