/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('titles', (table) => {
    table.uuid('title_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('title_name', 100).notNullable();
    table.uuid('department_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    table.timestamp('deleted_at');
    table.uuid('deleted_by');
    table.boolean('is_delete').defaultTo(false);
    
    table.foreign('department_id').references('department_id').inTable('departments').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('titles');
};
