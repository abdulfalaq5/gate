/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('on_board_documents', (table) => {
    table.uuid('on_board_document_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('candidate_id').nullable();
    table.varchar('on_board_document_name').nullable();
    table.text('on_board_document_file').nullable();
    table.text('on_board_document_description').nullable();
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
  return knex.schema.dropTable('on_board_documents');
};

