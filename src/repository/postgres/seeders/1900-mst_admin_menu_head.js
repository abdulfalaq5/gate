/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const mst_heading_admin_menu_datas = [
    {
      heading_admin_menu_id: '1',
      nama_heading: 'Dashboard',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '2',
      nama_heading: 'Management User',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '3',
      nama_heading: 'Master Data',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '4',
      nama_heading: 'Corporate',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '5',
      nama_heading: 'Service',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '6',
      nama_heading: 'News',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '7',
      nama_heading: 'Contact Us',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '8',
      nama_heading: 'Career',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      heading_admin_menu_id: '9',
      nama_heading: 'Language',
      created_at: '2025-04-24 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ];
  return knex('mst_heading_admin_menu').del()
    .then(() => knex('mst_heading_admin_menu').insert(mst_heading_admin_menu_datas));
};
