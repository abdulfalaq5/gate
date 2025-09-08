/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('mst_admin_menu').del()
  const admin_menu = [
    {
      menu_id: '42',
      parent: '31',
      menu_name: 'Review',
      menu_url: 'admin/management-member/review',
      menu_status: '1',
      menu_sort: '6',
      menu_icon: 'fas fa-star',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'review',
      heading_admin_menu_id: '3'
    }
  ]
  return knex('mst_admin_menu').insert(admin_menu);
};
