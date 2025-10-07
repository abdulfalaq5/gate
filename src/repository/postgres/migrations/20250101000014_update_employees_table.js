/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    // Add new columns for employee import
    table.uuid('gender_id').nullable();
    table.uuid('department_id').nullable();
    table.string('employee_mobile', 20).nullable();
    table.string('employee_office_number', 20).nullable();
    table.text('employee_address').nullable();
    table.string('employee_exmail_account', 100).nullable();
    table.string('employee_channel', 100).nullable();
    table.string('employee_activation_status', 50).nullable();
    table.boolean('employee_disabled').defaultTo(false);
    table.string('employee_wechat_workplace', 100).nullable();
    
    // Add foreign key constraints
    table.foreign('gender_id').references('gender_id').inTable('genders');
    table.foreign('department_id').references('department_id').inTable('departments');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    // Drop foreign key constraints first
    table.dropForeign(['gender_id']);
    table.dropForeign(['department_id']);
    
    // Drop columns
    table.dropColumn('gender_id');
    table.dropColumn('department_id');
    table.dropColumn('employee_mobile');
    table.dropColumn('employee_office_number');
    table.dropColumn('employee_address');
    table.dropColumn('employee_exmail_account');
    table.dropColumn('employee_channel');
    table.dropColumn('employee_activation_status');
    table.dropColumn('employee_disabled');
    table.dropColumn('employee_wechat_workplace');
  });
};
