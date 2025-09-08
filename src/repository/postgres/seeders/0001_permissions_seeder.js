/* eslint-disable implicit-arrow-linebreak */
/**
 * Seeder untuk semua permissions
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const crypto = require('crypto');
  
  console.log('🌱 Creating Permissions seeder...');
  
  try {
    // Deletes ALL existing entries
    await knex('permissions').del();
    
    // Insert all permissions
    const permissions = [
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'read',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'create',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'update',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'delete',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'export',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'preview',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'upload',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'download',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'email',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        permission_id: crypto.randomUUID(),
        permission_name: 'reset_password',
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      }
    ];
    
    await knex('permissions').insert(permissions);
    
    console.log('✅ Permissions seeder completed successfully!');
    console.log(`📊 Total permissions inserted: ${permissions.length}`);
    
  } catch (error) {
    console.error('❌ Error in Permissions seeder:', error);
    throw error;
  }
};
