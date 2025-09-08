/* eslint-disable implicit-arrow-linebreak */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  const data = [
    {
      role_id: 'd91f74b0-2e7d-4f86-a1aa-727d6ea3ac21',
      role_name: 'Administrator',
      created_at: '2022-10-17 15:55:36.710 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ]
  return knex('mst_role').del()
    .then(() =>
      // Inserts seed entries
      knex('mst_role').insert(data));
};
