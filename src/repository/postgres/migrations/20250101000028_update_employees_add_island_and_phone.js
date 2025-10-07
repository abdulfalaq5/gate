/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    table.uuid('island_id').nullable();
    table.string('employee_phone', 20).nullable();
    
    // Add foreign key constraint
    table.foreign('island_id').references('island_id').inTable('islands');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    // Drop foreign key constraint first
    table.dropForeign(['island_id']);
    
    // Drop columns
    table.dropColumn('island_id');
    table.dropColumn('employee_phone');
  });
};
