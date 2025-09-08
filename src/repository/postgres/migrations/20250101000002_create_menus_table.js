/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('menus', (table) => {
    table.uuid('menu_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('menu_name', 100).notNullable();
    table.uuid('menu_parent_id').nullable();
    table.string('menu_url', 255).nullable();
    table.string('menu_icon', 150).defaultTo('far fa-circle nav-icon');
    table.integer('menu_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    table.timestamp('deleted_at');
    table.uuid('deleted_by');
    table.boolean('is_delete').defaultTo(false);
    
    table.foreign('menu_parent_id').references('menu_id').inTable('menus');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('menus');
};
