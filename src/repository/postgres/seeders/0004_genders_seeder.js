const { v4: uuidv4 } = require('uuid')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('genders').del()
  
  // Inserts seed entries
  await knex('genders').insert([
    {
      gender_id: uuidv4(),
      gender_name: 'Male',
      created_at: new Date().toISOString(),
      created_by: null,
      is_delete: false
    },
    {
      gender_id: uuidv4(),
      gender_name: 'Female',
      created_at: new Date().toISOString(),
      created_by: null,
      is_delete: false
    },
    {
      gender_id: uuidv4(),
      gender_name: 'Other',
      created_at: new Date().toISOString(),
      created_by: null,
      is_delete: false
    }
  ])
}
