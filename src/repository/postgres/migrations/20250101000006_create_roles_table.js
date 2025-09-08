/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('roles', (table) => {
    table.uuid('role_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('role_name', 100).notNullable();
    table.uuid('role_parent_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    table.timestamp('deleted_at');
    table.uuid('deleted_by');
    table.boolean('is_delete').defaultTo(false);
    
    table.foreign('role_parent_id').references('role_id').inTable('roles');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
