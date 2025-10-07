/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('employeeHasPermissions', (table) => {
    table.uuid('menu_id').nullable();
    table.foreign('menu_id').references('menu_id').inTable('menus').onDelete('CASCADE');
    
    // Update primary key to include menu_id
    table.dropPrimary();
    table.primary(['employee_id', 'permission_id', 'menu_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('employeeHasPermissions', (table) => {
    table.dropPrimary();
    table.dropForeign('menu_id');
    table.dropColumn('menu_id');
    table.primary(['employee_id', 'permission_id']);
  });
};
