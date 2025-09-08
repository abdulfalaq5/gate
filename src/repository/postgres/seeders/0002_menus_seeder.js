/* eslint-disable implicit-arrow-linebreak */
/**
 * Seeder untuk semua menus
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const crypto = require('crypto');
  
  console.log('🌱 Creating Menus seeder...');
  
  try {
    // Deletes ALL existing entries
    await knex('menus').del();
    
    // Insert all menus
    const menus = [
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Dashboard',
        menu_url: '/dashboard',
        menu_icon: 'dashboard',
        menu_parent_id: null,
        menu_order: 1,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Companies',
        menu_url: '/companies',
        menu_icon: 'business',
        menu_parent_id: null,
        menu_order: 2,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Departments',
        menu_url: '/departments',
        menu_icon: 'account_tree',
        menu_parent_id: null,
        menu_order: 3,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Titles',
        menu_url: '/titles',
        menu_icon: 'work',
        menu_parent_id: null,
        menu_order: 4,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Employees',
        menu_url: '/employees',
        menu_icon: 'people',
        menu_parent_id: null,
        menu_order: 5,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Users',
        menu_url: '/users',
        menu_icon: 'person',
        menu_parent_id: null,
        menu_order: 6,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Roles',
        menu_url: '/roles',
        menu_icon: 'admin_panel_settings',
        menu_parent_id: null,
        menu_order: 7,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Permissions',
        menu_url: '/permissions',
        menu_icon: 'security',
        menu_parent_id: null,
        menu_order: 8,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Import',
        menu_url: '/import',
        menu_icon: 'upload_file',
        menu_parent_id: null,
        menu_order: 9,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      },
      {
        menu_id: crypto.randomUUID(),
        menu_name: 'Systems',
        menu_url: '/systems',
        menu_icon: 'settings',
        menu_parent_id: null,
        menu_order: 10,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null
      }
    ];
    
    await knex('menus').insert(menus);
    
    console.log('✅ Menus seeder completed successfully!');
    console.log(`📊 Total menus inserted: ${menus.length}`);
    
  } catch (error) {
    console.error('❌ Error in Menus seeder:', error);
    throw error;
  }
};
