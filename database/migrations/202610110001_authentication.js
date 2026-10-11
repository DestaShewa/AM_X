export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("roles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(50)", notNull: true, unique: true },
    description: { type: "text" },
    permissions: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'{}'::jsonb"),
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

  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    role_id: {
      type: "uuid",
      notNull: true,
      references: "roles",
      onDelete: "RESTRICT",
    },
    full_name: { type: "varchar(150)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    status: { type: "varchar(20)", notNull: true, default: "ACTIVE" },
    last_login_at: { type: "timestamptz" },
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
  pgm.addConstraint("users", "users_status_check", {
    check: "status IN ('ACTIVE', 'INACTIVE')",
  });
  pgm.addConstraint("users", "users_email_lowercase_check", {
    check: "email = lower(email)",
  });

  pgm.createTable("user_sessions", {
    sid: { type: "varchar", primaryKey: true },
    sess: { type: "json", notNull: true },
    expire: { type: "timestamptz", notNull: true },
  });
  pgm.createIndex("user_sessions", "expire", {
    name: "user_sessions_expire_idx",
  });
}

export async function down(pgm) {
  pgm.dropTable("user_sessions");
  pgm.dropTable("users");
  pgm.dropTable("roles");
}
