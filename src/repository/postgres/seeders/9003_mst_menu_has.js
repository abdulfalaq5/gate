/* eslint-disable implicit-arrow-linebreak */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  const data = [
    {
      menu_id: 37,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 37,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 37,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 37,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 38,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 38,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 38,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 38,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 39,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 39,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 39,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 39,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ]
  return knex('mst_menu_has_permissions').insert(data);
};
