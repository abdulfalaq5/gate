/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Delete existing entries
  await knex('bank_accounts').del();

  // Insert sample bank accounts data
  await knex('bank_accounts').insert([
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'BCA KCP Sudirman',
      bank_account_number: '1234567890',
      bank_account_type: 'Giro',
      bank_account_balance: 5000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Mandiri KCP Thamrin',
      bank_account_number: '9876543210',
      bank_account_type: 'Tabungan',
      bank_account_balance: 2500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'BNI KCP Gatot Subroto',
      bank_account_number: '5555555555',
      bank_account_type: 'Giro',
      bank_account_balance: 7500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'CIMB KCP Kuningan',
      bank_account_number: '1111222233',
      bank_account_type: 'Tabungan',
      bank_account_balance: 1500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Danamon KCP Kebayoran',
      bank_account_number: '4444555566',
      bank_account_type: 'Giro',
      bank_account_balance: 3000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'HSBC KCP SCBD',
      bank_account_number: '7777888899',
      bank_account_type: 'Tabungan',
      bank_account_balance: 10000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Maybank KCP Menteng',
      bank_account_number: '2468135790',
      bank_account_type: 'Giro',
      bank_account_balance: 4500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Permata KCP Senayan',
      bank_account_number: '1357924680',
      bank_account_type: 'Tabungan',
      bank_account_balance: 2000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'OCBC KCP Kemang',
      bank_account_number: '9087654321',
      bank_account_type: 'Giro',
      bank_account_balance: 6000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'UOB KCP Menteng',
      bank_account_number: '1212121212',
      bank_account_type: 'Tabungan',
      bank_account_balance: 3500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Standard Chartered KCP Plaza Indonesia',
      bank_account_number: '3434343434',
      bank_account_type: 'Giro',
      bank_account_balance: 8500000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      bank_account_id: knex.raw('uuid_generate_v4()'),
      bank_account_name: 'Citibank KCP BSD City',
      bank_account_number: '5656565656',
      bank_account_type: 'Tabungan',
      bank_account_balance: 4000000.00,
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    }
  ]);
};

