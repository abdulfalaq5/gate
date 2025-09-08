/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('menuHasPermissions', (table) => {
    table.uuid('menu_id').notNullable();
    table.uuid('permission_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    
    table.primary(['menu_id', 'permission_id']);
    table.foreign('menu_id').references('menu_id').inTable('menus').onDelete('CASCADE');
    table.foreign('permission_id').references('permission_id').inTable('permissions').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('menuHasPermissions');
};
