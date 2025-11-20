/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('candidates', (table) => {
    table.enum('candidate_status', ['new', 'interviewed', 'scheduled', 'completed', 'hired', 'rejected', 'hold']).defaultTo('new').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('candidates', (table) => {
    table.dropColumn('candidate_status');
  });
};

