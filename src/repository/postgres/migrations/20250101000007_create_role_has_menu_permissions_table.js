/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('roleHasMenuPermissions', (table) => {
    table.uuid('role_id').notNullable();
    table.uuid('menu_id').notNullable();
    table.uuid('permission_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.timestamp('updated_at');
    table.uuid('updated_by');
    
    table.primary(['role_id', 'menu_id', 'permission_id']);
    table.foreign('role_id').references('role_id').inTable('roles').onDelete('CASCADE');
    table.foreign('menu_id').references('menu_id').inTable('menus').onDelete('CASCADE');
    table.foreign('permission_id').references('permission_id').inTable('permissions').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('roleHasMenuPermissions');
};
