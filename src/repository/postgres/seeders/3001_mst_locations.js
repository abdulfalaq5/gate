/* eslint-disable implicit-arrow-linebreak */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  const data = [
    {
      location_id: 'ccdf2a53-b7b8-4d37-9d65-d30753564baa',
      location_code: 'JAK',
      location_name: 'Jakarta',
      location_account_number: '21314241',
      location_code_inventory: '222',
      location_code_accounting: '1234',
      location_type: 'car and bike',
      location_detail: 'jl jakarta 123',
      location_status: '1',
      created_at: '2022-09-26 11:51:49.099 +0700',
      created_by: '85248ec8-e6e3-48bb-9ab1-9118569213b4',
      updated_at: '2022-09-26 11:51:49.092 +0700',
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ]
  return knex('mst_location').del()
    .then(() =>
      // Inserts seed entries
      knex('mst_location').insert(data));
};
