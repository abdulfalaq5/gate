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
      menu_id: '40',
      parent: '5',
      menu_name: 'Product Model',
      menu_url: 'admin/management-product/product-model',
      menu_status: '1',
      menu_sort: '3',
      menu_icon: 'fas fa-cogs',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'productmodel',
      heading_admin_menu_id: '3'
    },
    {
      menu_id: '41',
      parent: '5',
      menu_name: 'Product Dimensi',
      menu_url: 'admin/management-product/product-dimensi',
      menu_status: '1',
      menu_sort: '3',
      menu_icon: 'fas fa-cogs',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'productdimensi',
      heading_admin_menu_id: '3'
    }
  ]
  return knex('mst_admin_menu').insert(admin_menu);
};
