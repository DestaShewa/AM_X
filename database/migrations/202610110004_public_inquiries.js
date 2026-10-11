export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("customers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    full_name: { type: "varchar(150)", notNull: true },
    phone: { type: "varchar(30)", notNull: true },
    whatsapp_number: { type: "varchar(30)" },
    email: { type: "varchar(255)" },
    preferred_contact_method: { type: "varchar(20)", notNull: true },
    location: { type: "varchar(255)" },
    notes: { type: "text" },
    status: { type: "varchar(20)", notNull: true, default: "ACTIVE" },
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
  pgm.addConstraint("customers", "customers_contact_method_check", {
    check: "preferred_contact_method IN ('PHONE', 'WHATSAPP', 'EMAIL')",
  });

  pgm.createTable("inquiries", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    reference: { type: "varchar(30)", notNull: true, unique: true },
    customer_id: {
      type: "uuid",
      notNull: true,
      references: "customers",
      onDelete: "RESTRICT",
    },
    package_id: {
      type: "uuid",
      references: "packages",
      onDelete: "SET NULL",
    },
    travel_date: { type: "date", notNull: true },
    traveler_count: { type: "integer", notNull: true },
    arrival_location: { type: "varchar(255)", notNull: true },
    duration_days: { type: "integer", notNull: true },
    budget_amount: { type: "numeric(12,2)" },
    budget_currency: { type: "char(3)", notNull: true, default: "ETB" },
    interests: { type: "text" },
    hotel_required: { type: "boolean", notNull: true, default: false },
    transport_required: { type: "boolean", notNull: true, default: false },
    special_requests: { type: "text" },
    status: { type: "varchar(35)", notNull: true, default: "NEW" },
    assigned_user_id: {
      type: "uuid",
      references: "users",
      onDelete: "SET NULL",
    },
    internal_notes: { type: "text" },
    idempotency_key: { type: "uuid", notNull: true, unique: true },
    request_hash: { type: "char(64)", notNull: true },
    privacy_consent_at: { type: "timestamptz", notNull: true },
    privacy_notice_version: { type: "varchar(32)", notNull: true },
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
  pgm.addConstraint("inquiries", "inquiries_traveler_count_positive_check", {
    check: "traveler_count > 0",
  });
  pgm.addConstraint("inquiries", "inquiries_duration_positive_check", {
    check: "duration_days > 0",
  });
  pgm.addConstraint("inquiries", "inquiries_budget_nonnegative_check", {
    check: "budget_amount IS NULL OR budget_amount >= 0",
  });
  pgm.createIndex("inquiries", ["status", "created_at"], {
    name: "inquiries_status_created_idx",
  });
  pgm.createIndex("inquiries", ["customer_id", "created_at"], {
    name: "inquiries_customer_created_idx",
  });
}

export async function down(pgm) {
  pgm.dropTable("inquiries");
  pgm.dropTable("customers");
}
