/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('background_checks', (table) => {
    table.uuid('background_check_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('candidate_id').nullable();
    table.text('background_check_note').nullable();
    table.text('background_file').nullable();
    table.enum('background_status', ['hired', 'rejected', 'hold']).nullable();
    table.text('background_description').nullable();
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
  return knex.schema.dropTable('background_checks');
};

