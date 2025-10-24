/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // This migration file was missing and causing corruption
  // No actual database changes needed
  return Promise.resolve();
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // This migration file was missing and causing corruption
  // No actual database changes needed
  return Promise.resolve();
};

