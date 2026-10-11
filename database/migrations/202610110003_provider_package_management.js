export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("providers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(180)", notNull: true },
    provider_type: { type: "varchar(40)", notNull: true },
    phone: { type: "varchar(30)", notNull: true },
    email: { type: "varchar(255)" },
    location: { type: "varchar(255)", notNull: true },
    languages: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    services_offered: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
    pricing_notes: { type: "text" },
    availability_notes: { type: "text" },
    verification_status: {
      type: "varchar(30)",
      notNull: true,
      default: "UNVERIFIED",
    },
    license_details: { type: "text" },
    qualification_details: { type: "text" },
    agreement_status: {
      type: "varchar(30)",
      notNull: true,
      default: "PENDING",
    },
    commission_terms: { type: "text" },
    notes: { type: "text" },
    status: { type: "varchar(20)", notNull: true, default: "INACTIVE" },
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
  pgm.addConstraint("providers", "providers_verification_status_check", {
    check: "verification_status IN ('UNVERIFIED', 'VERIFIED')",
  });
  pgm.addConstraint("providers", "providers_agreement_status_check", {
    check: "agreement_status IN ('PENDING', 'ACTIVE', 'INACTIVE')",
  });
  pgm.addConstraint("providers", "providers_status_check", {
    check: "status IN ('ACTIVE', 'SUSPENDED', 'INACTIVE')",
  });
  pgm.addConstraint("providers", "providers_languages_array_check", {
    check: "jsonb_typeof(languages) = 'array'",
  });
  pgm.addConstraint("providers", "providers_services_array_check", {
    check: "jsonb_typeof(services_offered) = 'array'",
  });

  pgm.createTable(
    "package_providers",
    {
      package_id: {
        type: "uuid",
        notNull: true,
        references: "packages",
        onDelete: "CASCADE",
      },
      provider_id: {
        type: "uuid",
        notNull: true,
        references: "providers",
        onDelete: "RESTRICT",
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    { constraints: { primaryKey: ["package_id", "provider_id"] } },
  );
  pgm.createIndex("package_providers", "provider_id", {
    name: "package_providers_provider_idx",
  });

  pgm.createTable("audit_logs", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "SET NULL",
    },
    action: { type: "varchar(100)", notNull: true },
    entity_type: { type: "varchar(100)", notNull: true },
    entity_id: { type: "uuid" },
    change_summary: { type: "jsonb" },
    correlation_id: { type: "uuid" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createIndex("audit_logs", ["entity_type", "entity_id", "created_at"], {
    name: "audit_logs_entity_history_idx",
  });
}

export async function down(pgm) {
  pgm.dropTable("audit_logs");
  pgm.dropTable("package_providers");
  pgm.dropTable("providers");
}
