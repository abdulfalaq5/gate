/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    // Update sso_authorization_codes table
    .alterTable('sso_authorization_codes', (table) => {
      // Drop existing foreign key constraint
      table.dropForeign(['user_id']);
      // Rename user_id to employee_id
      table.renameColumn('user_id', 'employee_id');
    })
    .then(() => {
      // Add new foreign key constraint to employees table
      return knex.schema.alterTable('sso_authorization_codes', (table) => {
        table.foreign('employee_id').references('employee_id').inTable('employees').onDelete('CASCADE');
      });
    })
    // Update sso_token_blacklist table
    .then(() => {
      return knex.schema.alterTable('sso_token_blacklist', (table) => {
        // Drop existing foreign key constraint
        table.dropForeign(['user_id']);
        // Rename user_id to employee_id
        table.renameColumn('user_id', 'employee_id');
      });
    })
    .then(() => {
      // Add new foreign key constraint to employees table
      return knex.schema.alterTable('sso_token_blacklist', (table) => {
        table.foreign('employee_id').references('employee_id').inTable('employees').onDelete('CASCADE');
      });
    })
    // Update sso_sessions table
    .then(() => {
      return knex.schema.alterTable('sso_sessions', (table) => {
        // Drop existing foreign key constraint
        table.dropForeign(['user_id']);
        // Rename user_id to employee_id
        table.renameColumn('user_id', 'employee_id');
      });
    })
    .then(() => {
      // Add new foreign key constraint to employees table
      return knex.schema.alterTable('sso_sessions', (table) => {
        table.foreign('employee_id').references('employee_id').inTable('employees').onDelete('CASCADE');
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    // Revert sso_authorization_codes table
    .alterTable('sso_authorization_codes', (table) => {
      // Drop foreign key constraint to employees
      table.dropForeign(['employee_id']);
      // Rename employee_id back to user_id
      table.renameColumn('employee_id', 'user_id');
    })
    .then(() => {
      // Add back foreign key constraint to users table
      return knex.schema.alterTable('sso_authorization_codes', (table) => {
        table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
      });
    })
    // Revert sso_token_blacklist table
    .then(() => {
      return knex.schema.alterTable('sso_token_blacklist', (table) => {
        // Drop foreign key constraint to employees
        table.dropForeign(['employee_id']);
        // Rename employee_id back to user_id
        table.renameColumn('employee_id', 'user_id');
      });
    })
    .then(() => {
      // Add back foreign key constraint to users table
      return knex.schema.alterTable('sso_token_blacklist', (table) => {
        table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
      });
    })
    // Revert sso_sessions table
    .then(() => {
      return knex.schema.alterTable('sso_sessions', (table) => {
        // Drop foreign key constraint to employees
        table.dropForeign(['employee_id']);
        // Rename employee_id back to user_id
        table.renameColumn('employee_id', 'user_id');
      });
    })
    .then(() => {
      // Add back foreign key constraint to users table
      return knex.schema.alterTable('sso_sessions', (table) => {
        table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
      });
    });
};
