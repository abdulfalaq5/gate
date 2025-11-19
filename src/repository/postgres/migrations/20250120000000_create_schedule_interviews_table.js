/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('schedule_interviews', (table) => {
    table.uuid('schedule_interview_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('candidate_id').nullable();
    table.string('assign_role', 255).nullable();
    table.date('schedule_interview_date').nullable();
    table.time('schedule_interview_time').nullable();
    table.string('schedule_interview_duration', 255).nullable();
    table.text('schedule_interview_description').nullable();
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
  return knex.schema.dropTable('schedule_interviews');
};

