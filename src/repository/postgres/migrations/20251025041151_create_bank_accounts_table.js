/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('bank_accounts', (table) => {
    table.uuid('bank_account_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('bank_account_name', 255).nullable();
    table.string('bank_account_number', 255).nullable();
    table.string('bank_account_type', 255).nullable();
    table.decimal('bank_account_balance', 10, 2).nullable();
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
  return knex.schema.dropTable('bank_accounts');
};

