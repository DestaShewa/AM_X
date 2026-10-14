export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("follow_ups", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    customer_id: {
      type: "uuid",
      references: "customers",
      onDelete: "RESTRICT",
    },
    inquiry_id: {
      type: "uuid",
      references: "inquiries",
      onDelete: "RESTRICT",
    },
    assigned_user_id: {
      type: "uuid",
      references: "users",
      onDelete: "SET NULL",
    },
    description: { type: "text", notNull: true },
    due_at: { type: "timestamptz", notNull: true },
    status: { type: "varchar(20)", notNull: true, default: "PENDING" },
    completed_at: { type: "timestamptz" },
    outcome_notes: { type: "text" },
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
  pgm.addConstraint("follow_ups", "follow_ups_exactly_one_target_check", {
    check: "num_nonnulls(customer_id, inquiry_id) = 1",
  });
  pgm.addConstraint("follow_ups", "follow_ups_status_check", {
    check: "status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')",
  });
  pgm.addConstraint("follow_ups", "follow_ups_completion_check", {
    check: "(status = 'COMPLETED') = (completed_at IS NOT NULL)",
  });
  pgm.createIndex("follow_ups", ["status", "due_at"], {
    name: "follow_ups_status_due_idx",
  });
  pgm.createIndex("follow_ups", ["assigned_user_id", "status", "due_at"], {
    name: "follow_ups_assignment_due_idx",
  });
  pgm.createIndex("follow_ups", "customer_id", {
    name: "follow_ups_customer_idx",
  });
  pgm.createIndex("follow_ups", "inquiry_id", {
    name: "follow_ups_inquiry_idx",
  });
}

export async function down(pgm) {
  pgm.dropTable("follow_ups");
}
