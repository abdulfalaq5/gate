/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('systems', (table) => {
    table.uuid('system_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('system_name', 100).notNullable();
    table.string('system_url', 255).nullable();
    table.string('system_icon', 150).defaultTo('far fa-circle nav-icon');
    table.integer('system_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    table.timestamp('deleted_at');
    table.uuid('deleted_by');
    table.boolean('is_delete').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('systems');
};
