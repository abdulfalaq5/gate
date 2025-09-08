/* eslint-disable implicit-arrow-linebreak */
/**
 * Seeder untuk data sample lengkap
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const crypto = require('crypto');
  const bcrypt = require('bcrypt');
  
  console.log('🌱 Creating Sample Data seeder...');
  
  try {
    // Generate UUIDs untuk konsistensi
    const companyId = crypto.randomUUID();
    const departmentId = crypto.randomUUID();
    const titleId = crypto.randomUUID();
    const employeeId = crypto.randomUUID();
    const roleId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    const systemId1 = crypto.randomUUID();
    const systemId2 = crypto.randomUUID();
    
    // Insert Company
    await knex('companies').insert({
      company_id: companyId,
      company_name: 'PT. Sample Company',
      company_parent_id: null,
      company_address: 'Jl. Sample Address No. 123',
      company_email: 'info@samplecompany.com',
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Department
    await knex('departments').insert({
      department_id: departmentId,
      department_name: 'IT',
      department_parent_id: null,
      company_id: companyId,
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Title
    await knex('titles').insert({
      title_id: titleId,
      title_name: 'Back End Developer',
      department_id: departmentId,
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Employee
    await knex('employees').insert({
      employee_id: employeeId,
      employee_name: 'Super Admin',
      employee_email: 'superadmin@gmail.com',
      title_id: titleId,
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Role
    await knex('roles').insert({
      role_id: roleId,
      role_name: 'Super Admin',
      role_parent_id: null,
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert User
    const hashedPassword = await bcrypt.hash('password123', 10);
    await knex('users').insert({
      user_id: userId,
      employee_id: employeeId,
      role_id: roleId,
      user_name: 'admin',
      user_email: 'superadmin@gmail.com',
      user_password: hashedPassword,
      created_at: new Date().toISOString(),
      created_by: null,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Systems
    await knex('systems').insert([
      {
        system_id: systemId1,
        system_name: 'Central User',
        system_url: 'http://localhost:3000',
        system_icon: 'fas fa-users',
        system_order: 1,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        system_id: systemId2,
        system_name: 'Interview',
        system_url: 'http://localhost:3001',
        system_icon: 'fas fa-clipboard-list',
        system_order: 2,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Get all menus and permissions
    const menus = await knex('menus').select('*');
    const permissions = await knex('permissions').select('*');
    
    // Insert System-Menu relationships
    const systemMenuInserts = [];
    for (const menu of menus) {
      systemMenuInserts.push({
        system_id: systemId1,
        menu_id: menu.menu_id,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null
      });
    }
    await knex('systemHasMenus').insert(systemMenuInserts);
    
    // Insert Menu-Permission relationships
    const menuPermissionInserts = [];
    for (const menu of menus) {
      for (const permission of permissions) {
        menuPermissionInserts.push({
          menu_id: menu.menu_id,
          permission_id: permission.permission_id,
          created_at: new Date().toISOString(),
          created_by: null,
          updated_at: null,
          updated_by: null
        });
      }
    }
    await knex('menuHasPermissions').insert(menuPermissionInserts);
    
    // Insert Role-Menu-Permission relationships
    const roleMenuPermissionInserts = [];
    for (const menu of menus) {
      for (const permission of permissions) {
        roleMenuPermissionInserts.push({
          role_id: roleId,
          menu_id: menu.menu_id,
          permission_id: permission.permission_id,
          created_at: new Date().toISOString(),
          created_by: null,
          updated_at: null,
          updated_by: null
        });
      }
    }
    await knex('roleHasMenuPermissions').insert(roleMenuPermissionInserts);
    
    console.log('✅ Sample Data seeder completed successfully!');
    console.log('📊 Data inserted:');
    console.log('  - 1 Company');
    console.log('  - 1 Department');
    console.log('  - 1 Title');
    console.log('  - 1 Employee');
    console.log('  - 1 Role');
    console.log('  - 1 User');
    console.log('  - 2 Systems');
    console.log(`  - ${menus.length} System-Menu relationships`);
    console.log(`  - ${menus.length * permissions.length} Menu-Permission relationships`);
    console.log(`  - ${menus.length * permissions.length} Role-Menu-Permission relationships`);
    
  } catch (error) {
    console.error('❌ Error in Sample Data seeder:', error);
    throw error;
  }
};
