/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Delete existing entries
  await knex('customers').del();

  // Insert sample customers data
  await knex('customers').insert([
    {
      customer_id: knex.raw('uuid_generate_v4()'),
      customer_name: 'John Doe',
      customer_email: 'john.doe@example.com',
      customer_phone: '+6281234567890',
      customer_address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      customer_city: 'Jakarta',
      customer_state: 'DKI Jakarta',
      customer_zip: '12190',
      customer_country: 'Indonesia',
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      customer_id: knex.raw('uuid_generate_v4()'),
      customer_name: 'Jane Smith',
      customer_email: 'jane.smith@example.com',
      customer_phone: '+6281234567891',
      customer_address: 'Jl. Thamrin No. 456, Jakarta Pusat',
      customer_city: 'Jakarta',
      customer_state: 'DKI Jakarta',
      customer_zip: '10350',
      customer_country: 'Indonesia',
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      customer_id: knex.raw('uuid_generate_v4()'),
      customer_name: 'Ahmad Rahman',
      customer_email: 'ahmad.rahman@example.com',
      customer_phone: '+6281234567892',
      customer_address: 'Jl. Gatot Subroto No. 789, Bandung',
      customer_city: 'Bandung',
      customer_state: 'Jawa Barat',
      customer_zip: '40112',
      customer_country: 'Indonesia',
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      customer_id: knex.raw('uuid_generate_v4()'),
      customer_name: 'Maria Garcia',
      customer_email: 'maria.garcia@example.com',
      customer_phone: '+6281234567893',
      customer_address: 'Jl. Diponegoro No. 321, Surabaya',
      customer_city: 'Surabaya',
      customer_state: 'Jawa Timur',
      customer_zip: '60241',
      customer_country: 'Indonesia',
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    },
    {
      customer_id: knex.raw('uuid_generate_v4()'),
      customer_name: 'David Wilson',
      customer_email: 'david.wilson@example.com',
      customer_phone: '+6281234567894',
      customer_address: 'Jl. Malioboro No. 654, Yogyakarta',
      customer_city: 'Yogyakarta',
      customer_state: 'DI Yogyakarta',
      customer_zip: '55111',
      customer_country: 'Indonesia',
      created_by: knex.raw('(SELECT employee_id FROM employees LIMIT 1)'),
      is_delete: false
    }
  ]);
};
