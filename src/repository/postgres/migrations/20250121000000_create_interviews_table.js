/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('interviews', (table) => {
    table.uuid('interview_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('schedule_interview_id').nullable();
    table.uuid('employee_id').nullable();
    table.string('interview_company_value', 255).nullable();
    table.string('interview_comment', 255).nullable();
    table.string('interview_total_score', 255).nullable();
    table.string('interview_description', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at');
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at');
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('interviews');
};

