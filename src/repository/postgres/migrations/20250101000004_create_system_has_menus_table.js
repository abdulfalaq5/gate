/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('systemHasMenus', (table) => {
    table.uuid('system_id').notNullable();
    table.uuid('menu_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    
    table.primary(['system_id', 'menu_id']);
    table.foreign('system_id').references('system_id').inTable('systems').onDelete('CASCADE');
    table.foreign('menu_id').references('menu_id').inTable('menus').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('systemHasMenus');
};
