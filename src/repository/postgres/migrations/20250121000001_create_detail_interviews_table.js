/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('detail_interviews', (table) => {
    table.uuid('detail_interview_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('interview_id').nullable();
    table.string('detail_interview_aspect', 255).nullable();
    table.string('detail_interview_question', 255).nullable();
    table.string('detail_interview_answer', 255).nullable();
    table.string('detail_interview_score', 255).nullable();
    table.string('detail_interview_description', 255).nullable();
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
  return knex.schema.dropTable('detail_interviews');
};

