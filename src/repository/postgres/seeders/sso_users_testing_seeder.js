const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Seeder untuk data user SSO testing
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  console.log('🌱 Creating SSO Users Testing Data seeder...');
  
  try {
    // Deletes ALL existing entries untuk testing
    await knex('roleHasMenuPermissions').del();
    await knex('menuHasPermissions').del();
    await knex('systemHasMenus').del();
    await knex('users').del();
    await knex('employees').del();
    await knex('titles').del();
    await knex('departments').del();
    await knex('companies').del();
    await knex('roles').del();
    await knex('menus').del();
    await knex('permissions').del();
    await knex('systems').del();

    // Generate UUIDs untuk konsistensi
    const companyId = crypto.randomUUID();
    const departmentId1 = crypto.randomUUID();
    const departmentId2 = crypto.randomUUID();
    const titleId1 = crypto.randomUUID();
    const titleId2 = crypto.randomUUID();
    const titleId3 = crypto.randomUUID();
    const employeeId1 = crypto.randomUUID();
    const employeeId2 = crypto.randomUUID();
    const employeeId3 = crypto.randomUUID();
    const roleId1 = crypto.randomUUID(); // Admin
    const roleId2 = crypto.randomUUID(); // Manager
    const roleId3 = crypto.randomUUID(); // User
    const userId1 = crypto.randomUUID(); // admin
    const userId2 = crypto.randomUUID(); // manager
    const userId3 = crypto.randomUUID(); // user
    const systemId = crypto.randomUUID();
    
    // Permission IDs
    const permissionIds = {
      read: crypto.randomUUID(),
      write: crypto.randomUUID(),
      delete: crypto.randomUUID(),
      admin: crypto.randomUUID(),
      manage_users: crypto.randomUUID(),
      manage_roles: crypto.randomUUID(),
      view_reports: crypto.randomUUID(),
      manage_company: crypto.randomUUID()
    };
    
    // Menu IDs
    const menuIds = {
      dashboard: crypto.randomUUID(),
      users: crypto.randomUUID(),
      roles: crypto.randomUUID(),
      companies: crypto.randomUUID(),
      departments: crypto.randomUUID(),
      employees: crypto.randomUUID(),
      reports: crypto.randomUUID(),
      settings: crypto.randomUUID()
    };

    // Insert Company
    await knex('companies').insert({
      company_id: companyId,
      company_name: 'PT. SSO Testing Company',
      company_parent_id: null,
      company_address: 'Jl. Testing SSO No. 123, Jakarta',
      company_email: 'info@sso-testing.com',
      created_at: new Date().toISOString(),
      created_by: userId1,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Insert Departments
    await knex('departments').insert([
      {
        department_id: departmentId1,
        department_name: 'IT Department',
        department_parent_id: null,
        company_id: companyId,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        department_id: departmentId2,
        department_name: 'HR Department',
        department_parent_id: null,
        company_id: companyId,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Titles
    await knex('titles').insert([
      {
        title_id: titleId1,
        title_name: 'System Administrator',
        department_id: departmentId1,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        title_id: titleId2,
        title_name: 'IT Manager',
        department_id: departmentId1,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        title_id: titleId3,
        title_name: 'HR Manager',
        department_id: departmentId2,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Employees
    await knex('employees').insert([
      {
        employee_id: employeeId1,
        employee_name: 'Admin User',
        employee_email: 'admin@sso-testing.com',
        title_id: titleId1,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        employee_id: employeeId2,
        employee_name: 'Manager User',
        employee_email: 'manager@sso-testing.com',
        title_id: titleId2,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        employee_id: employeeId3,
        employee_name: 'Regular User',
        employee_email: 'user@sso-testing.com',
        title_id: titleId3,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Roles
    await knex('roles').insert([
      {
        role_id: roleId1,
        role_name: 'Super Admin',
        role_parent_id: null,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        role_id: roleId2,
        role_name: 'Manager',
        role_parent_id: null,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        role_id: roleId3,
        role_name: 'User',
        role_parent_id: null,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Permissions
    await knex('permissions').insert([
      {
        permission_id: permissionIds.read,
        permission_name: 'read',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.write,
        permission_name: 'write',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.delete,
        permission_name: 'delete',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.admin,
        permission_name: 'admin',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.manage_users,
        permission_name: 'manage_users',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.manage_roles,
        permission_name: 'manage_roles',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.view_reports,
        permission_name: 'view_reports',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        permission_id: permissionIds.manage_company,
        permission_name: 'manage_company',
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Menus
    await knex('menus').insert([
      {
        menu_id: menuIds.dashboard,
        menu_name: 'Dashboard',
        menu_url: '/dashboard',
        menu_icon: 'dashboard',
        menu_parent_id: null,
        menu_order: 1,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.users,
        menu_name: 'Users',
        menu_url: '/users',
        menu_icon: 'people',
        menu_parent_id: null,
        menu_order: 2,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.roles,
        menu_name: 'Roles',
        menu_url: '/roles',
        menu_icon: 'security',
        menu_parent_id: null,
        menu_order: 3,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.companies,
        menu_name: 'Companies',
        menu_url: '/companies',
        menu_icon: 'business',
        menu_parent_id: null,
        menu_order: 4,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.departments,
        menu_name: 'Departments',
        menu_url: '/departments',
        menu_icon: 'account_tree',
        menu_parent_id: null,
        menu_order: 5,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.employees,
        menu_name: 'Employees',
        menu_url: '/employees',
        menu_icon: 'person',
        menu_parent_id: null,
        menu_order: 6,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.reports,
        menu_name: 'Reports',
        menu_url: '/reports',
        menu_icon: 'assessment',
        menu_parent_id: null,
        menu_order: 7,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        menu_id: menuIds.settings,
        menu_name: 'Settings',
        menu_url: '/settings',
        menu_icon: 'settings',
        menu_parent_id: null,
        menu_order: 8,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert System
    await knex('systems').insert({
      system_id: systemId,
      system_name: 'SSO Management System',
      system_url: 'http://localhost:9588',
      system_icon: 'fas fa-shield-alt',
      system_order: 1,
      created_at: new Date().toISOString(),
      created_by: userId1,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
      is_delete: false
    });
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Insert Users
    await knex('users').insert([
      {
        user_id: userId1,
        employee_id: employeeId1,
        role_id: roleId1,
        user_name: 'admin',
        user_email: 'admin@sso-testing.com',
        user_password: adminPassword,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        user_id: userId2,
        employee_id: employeeId2,
        role_id: roleId2,
        user_name: 'manager',
        user_email: 'manager@sso-testing.com',
        user_password: managerPassword,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      },
      {
        user_id: userId3,
        employee_id: employeeId3,
        role_id: roleId3,
        user_name: 'user',
        user_email: 'user@sso-testing.com',
        user_password: userPassword,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    ]);
    
    // Insert Menu Has Permissions
    await knex('menuHasPermissions').insert([
      // Dashboard permissions
      { menu_id: menuIds.dashboard, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Users permissions
      { menu_id: menuIds.users, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.users, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.users, permission_id: permissionIds.delete, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.users, permission_id: permissionIds.manage_users, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Roles permissions
      { menu_id: menuIds.roles, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.roles, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.roles, permission_id: permissionIds.delete, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.roles, permission_id: permissionIds.manage_roles, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Companies permissions
      { menu_id: menuIds.companies, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.companies, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.companies, permission_id: permissionIds.delete, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.companies, permission_id: permissionIds.manage_company, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Departments permissions
      { menu_id: menuIds.departments, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.departments, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.departments, permission_id: permissionIds.delete, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Employees permissions
      { menu_id: menuIds.employees, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.employees, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.employees, permission_id: permissionIds.delete, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Reports permissions
      { menu_id: menuIds.reports, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.reports, permission_id: permissionIds.view_reports, created_at: new Date().toISOString(), created_by: userId1 },
      
      // Settings permissions
      { menu_id: menuIds.settings, permission_id: permissionIds.read, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.settings, permission_id: permissionIds.write, created_at: new Date().toISOString(), created_by: userId1 },
      { menu_id: menuIds.settings, permission_id: permissionIds.admin, created_at: new Date().toISOString(), created_by: userId1 }
    ]);
    
    // Insert Role Has Menu Permissions
    // Super Admin - All permissions
    const adminPermissions = [
      { role_id: roleId1, menu_id: menuIds.dashboard, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.users, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.users, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.users, permission_id: permissionIds.delete },
      { role_id: roleId1, menu_id: menuIds.users, permission_id: permissionIds.manage_users },
      { role_id: roleId1, menu_id: menuIds.roles, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.roles, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.roles, permission_id: permissionIds.delete },
      { role_id: roleId1, menu_id: menuIds.roles, permission_id: permissionIds.manage_roles },
      { role_id: roleId1, menu_id: menuIds.companies, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.companies, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.companies, permission_id: permissionIds.delete },
      { role_id: roleId1, menu_id: menuIds.companies, permission_id: permissionIds.manage_company },
      { role_id: roleId1, menu_id: menuIds.departments, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.departments, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.departments, permission_id: permissionIds.delete },
      { role_id: roleId1, menu_id: menuIds.employees, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.employees, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.employees, permission_id: permissionIds.delete },
      { role_id: roleId1, menu_id: menuIds.reports, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.reports, permission_id: permissionIds.view_reports },
      { role_id: roleId1, menu_id: menuIds.settings, permission_id: permissionIds.read },
      { role_id: roleId1, menu_id: menuIds.settings, permission_id: permissionIds.write },
      { role_id: roleId1, menu_id: menuIds.settings, permission_id: permissionIds.admin }
    ];
    
    // Manager - Limited permissions
    const managerPermissions = [
      { role_id: roleId2, menu_id: menuIds.dashboard, permission_id: permissionIds.read },
      { role_id: roleId2, menu_id: menuIds.users, permission_id: permissionIds.read },
      { role_id: roleId2, menu_id: menuIds.users, permission_id: permissionIds.write },
      { role_id: roleId2, menu_id: menuIds.departments, permission_id: permissionIds.read },
      { role_id: roleId2, menu_id: menuIds.departments, permission_id: permissionIds.write },
      { role_id: roleId2, menu_id: menuIds.employees, permission_id: permissionIds.read },
      { role_id: roleId2, menu_id: menuIds.employees, permission_id: permissionIds.write },
      { role_id: roleId2, menu_id: menuIds.reports, permission_id: permissionIds.read },
      { role_id: roleId2, menu_id: menuIds.reports, permission_id: permissionIds.view_reports }
    ];
    
    // User - Basic permissions
    const userPermissions = [
      { role_id: roleId3, menu_id: menuIds.dashboard, permission_id: permissionIds.read },
      { role_id: roleId3, menu_id: menuIds.users, permission_id: permissionIds.read },
      { role_id: roleId3, menu_id: menuIds.departments, permission_id: permissionIds.read },
      { role_id: roleId3, menu_id: menuIds.employees, permission_id: permissionIds.read }
    ];
    
    // Insert all role permissions
    const allRolePermissions = [...adminPermissions, ...managerPermissions, ...userPermissions];
    for (const perm of allRolePermissions) {
      await knex('roleHasMenuPermissions').insert({
        ...perm,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null
      });
    }
    
    // Insert System Has Menus
    const allMenus = Object.values(menuIds);
    for (const menuId of allMenus) {
      await knex('systemHasMenus').insert({
        system_id: systemId,
        menu_id: menuId,
        created_at: new Date().toISOString(),
        created_by: userId1,
        updated_at: null,
        updated_by: null
      });
    }

    console.log('✅ SSO Users Testing Data seeded successfully!');
    console.log('');
    console.log('👥 Available Test Users:');
    console.log('   📧 admin@sso-testing.com / admin / admin123 (Super Admin)');
    console.log('   📧 manager@sso-testing.com / manager / manager123 (Manager)');
    console.log('   📧 user@sso-testing.com / user / user123 (User)');
    console.log('');
    console.log('🔑 Test Credentials for cURL:');
    console.log('   Username: admin, Password: admin123');
    console.log('   Username: manager, Password: manager123');
    console.log('   Username: user, Password: user123');
    console.log('');
    console.log('📋 Available SSO Clients:');
    console.log('   - external-system-client (password: "password")');
    console.log('   - test-client (password: "password")');
    console.log('');
    console.log('🌐 Test URLs:');
    console.log('   SSO Server: http://localhost:9588');
    console.log('   External System: http://localhost:3001');
    console.log('');
    console.log('📝 Example cURL Commands:');
    console.log('   curl -X POST http://localhost:9588/api/v1/auth/sso/login \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"user_name": "admin", "user_password": "admin123", "client_id": "external-system-client", "redirect_uri": "http://localhost:3001/auth/callback"}\'');
    
  } catch (error) {
    console.error('❌ Error seeding SSO Users Testing Data:', error);
    throw error;
  }
};
