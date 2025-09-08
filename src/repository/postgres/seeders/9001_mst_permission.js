/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('mst_permissions').del()
  await knex('mst_permissions').insert([
    {
      id: '1',
      name: 'read',
      created_at: '2022-08-02 12:12:59.001 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '2',
      name: 'create',
      created_at: '2022-08-02 12:12:59.043 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '3',
      name: 'update',
      created_at: '2022-08-02 12:12:59.093 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '4',
      name: 'delete',
      created_at: '2022-08-02 12:12:59.143 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '5',
      name: 'export',
      created_at: '2022-08-02 13:04:17.775 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '6',
      name: 'preview',
      created_at: '2022-10-05 17:05:21.401 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '7',
      name: 'upload',
      created_at: '2022-10-05 17:05:56.810 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '8',
      name: 'download',
      created_at: '2022-10-06 09:51:54.780 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '9',
      name: 'email',
      created_at: '2022-10-06 10:07:29.709 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      id: '10',
      name: 'reset_password',
      created_at: '2022-10-13 08:14:23.759 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ]);
};
