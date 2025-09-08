/* eslint-disable implicit-arrow-linebreak */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  const data = [
    // Menu ID 1 (CRUD)
    {
      menu_id: 1,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 1,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 1,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 1,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 2 (CRUD)
    {
      menu_id: 2,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 2,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 2,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 2,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 3 (CRUD)
    {
      menu_id: 3,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 3,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 3,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 3,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 4 (CRUD)
    {
      menu_id: 4,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 4,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 4,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 4,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 5 (CRUD)
    {
      menu_id: 5,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 5,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 5,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 5,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 6 (CRUD)
    {
      menu_id: 6,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 6,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 6,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 6,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 7 (CRUD)
    {
      menu_id: 7,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 7,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 7,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 7,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 8 (CRUD)
    {
      menu_id: 8,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 8,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 8,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 8,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 9 (CRUD)
    {
      menu_id: 9,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 9,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 9,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 9,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 10 (CRUD)
    {
      menu_id: 10,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 10,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 10,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 10,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 11 (CRUD)
    {
      menu_id: 11,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 11,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 11,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 11,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 12 (CRUD)
    {
      menu_id: 12,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 12,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 12,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 12,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 13 (CRUD)
    {
      menu_id: 13,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 13,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 13,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 13,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 14 (CRUD)
    {
      menu_id: 14,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 14,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 14,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 14,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 15 (CRUD)
    {
      menu_id: 15,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 15,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 15,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 15,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },

    // Menu ID 16 (CRUD)
    {
      menu_id: 16,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 16,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 16,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 16,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 17,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 17,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 17,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 17,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 18,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 18,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 18,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 18,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 19,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 19,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 19,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 19,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 20,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 20,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 20,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 20,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 21,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 21,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 21,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 21,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 22,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 22,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 22,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 22,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 23,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 23,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 23,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 23,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 24,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 24,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 24,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 24,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 25,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 25,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 25,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 25,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 26,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 26,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 26,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 26,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 27,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 27,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 27,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 27,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 28,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 28,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 28,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 28,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 29,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 29,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 29,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 29,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 30,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 30,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 30,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 30,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 31,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 31,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 31,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 31,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 32,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 32,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 32,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 32,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 33,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 33,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 33,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 33,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 34,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 34,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 34,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 34,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 35,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 35,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 35,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 35,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 36,
      permission_id: 1,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 36,
      permission_id: 2,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 36,
      permission_id: 3,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    },
    {
      menu_id: 36,
      permission_id: 4,
      created_at: '2025-03-11 11:54:24.776 +0700',
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null
    }
  ]
  return knex('mst_menu_has_permissions').del()
    .then(() =>
      // Inserts seed entries
      knex('mst_menu_has_permissions').insert(data));
};
