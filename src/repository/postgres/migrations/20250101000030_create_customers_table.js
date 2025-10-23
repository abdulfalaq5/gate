/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('customers', (table) => {
    table.uuid('customer_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('customer_name', 255).nullable();
    table.string('customer_email', 255).nullable();
    table.string('customer_phone', 255).nullable();
    table.text('customer_address').nullable();
    table.string('customer_city', 255).nullable();
    table.string('customer_state', 255).nullable();
    table.string('customer_zip', 255).nullable();
    table.string('customer_country', 255).nullable();
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
  return knex.schema.dropTable('customers');
};
