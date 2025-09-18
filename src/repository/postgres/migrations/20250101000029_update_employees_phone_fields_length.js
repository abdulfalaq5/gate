/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    // Mengubah panjang field phone dari 20 menjadi 50 karakter
    table.string('employee_phone', 50).alter();
    table.string('employee_mobile', 50).alter();
    table.string('employee_office_number', 50).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('employees', (table) => {
    // Mengembalikan panjang field phone ke 20 karakter
    table.string('employee_phone', 20).alter();
    table.string('employee_mobile', 20).alter();
    table.string('employee_office_number', 20).alter();
  });
};
