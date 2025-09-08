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
      menu_id: '37',
      parent: '5',
      menu_name: 'Specification',
      menu_url: 'admin/management-product/specification',
      menu_status: '1',
      menu_sort: '8',
      menu_icon: 'fas fa-cogs',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'specification',
      heading_admin_menu_id: '3'
    },
    {
      menu_id: '38',
      parent: '5',
      menu_name: 'Specification Label',
      menu_url: 'admin/management-product/specification-label',
      menu_status: '1',
      menu_sort: '9',
      menu_icon: 'fas fa-cogs',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'specificationlabel',
      heading_admin_menu_id: '3'
    },
    {
      menu_id: '39',
      parent: '5',
      menu_name: 'Specification Value',
      menu_url: 'admin/management-product/specification-value',
      menu_status: '1',
      menu_sort: '10',
      menu_icon: 'fas fa-cogs',
      created_at: '2025-05-28 10:00:00.000 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      permission_name: 'specificationvalue',
      heading_admin_menu_id: '3'
    }
  ]
  return knex('mst_admin_menu').insert(admin_menu);
};
