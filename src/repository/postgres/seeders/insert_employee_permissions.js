/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  console.log('🔄 Memulai insert employee permissions...');
  
  try {
    // Ambil semua employees
    const employees = await knex('employees')
      .select('employee_id', 'employee_name', 'employee_exmail_account')
      .whereNotNull('employee_exmail_account')
      .where('is_delete', false);
    
    // Ambil semua permissions
    const permissions = await knex('permissions')
      .select('permission_id', 'permission_name')
      .where('is_delete', false);
    
    // Ambil semua menus
    const menus = await knex('menus')
      .select('menu_id', 'menu_name', 'menu_url')
      .where('is_delete', false);
    
    console.log(`📊 Data yang ditemukan:`);
    console.log(`  - ${employees.length} employees`);
    console.log(`  - ${permissions.length} permissions`);
    console.log(`  - ${menus.length} menus`);
    
    if (employees.length === 0 || permissions.length === 0 || menus.length === 0) {
      console.log('⚠️  Tidak ada data untuk diproses');
      return;
    }
    
    // Hapus data lama di employeeHasPermissions
    await knex('employeeHasPermissions').del();
    console.log('🗑️  Data lama employeeHasPermissions telah dihapus');
    
    // Insert permissions untuk setiap employee
    let totalInserted = 0;
    
    for (const employee of employees) {
      console.log(`👤 Memproses employee: ${employee.employee_name}`);
      
      // Untuk setiap employee, berikan beberapa permissions pada menu yang berbeda
      const employeePermissions = [];
      
      // Berikan permission 'read' untuk semua menu
      for (const menu of menus) {
        const readPermission = permissions.find(p => p.permission_name === 'read');
        if (readPermission) {
          employeePermissions.push({
            employee_id: employee.employee_id,
            permission_id: readPermission.permission_id,
            menu_id: menu.menu_id,
            created_by: employee.employee_id,
            created_at: knex.fn.now()
          });
        }
      }
      
      // Berikan permission tambahan untuk beberapa menu (create, update, delete)
      const additionalPermissions = ['create', 'update', 'delete'];
      const menuSubset = menus.slice(0, Math.min(3, menus.length)); // Ambil 3 menu pertama
      
      for (const menu of menuSubset) {
        for (const permName of additionalPermissions) {
          const permission = permissions.find(p => p.permission_name === permName);
          if (permission) {
            employeePermissions.push({
              employee_id: employee.employee_id,
              permission_id: permission.permission_id,
              menu_id: menu.menu_id,
              created_by: employee.employee_id,
              created_at: knex.fn.now()
            });
          }
        }
      }
      
      // Insert permissions untuk employee ini
      if (employeePermissions.length > 0) {
        await knex('employeeHasPermissions').insert(employeePermissions);
        console.log(`  ✅ ${employeePermissions.length} permissions ditambahkan`);
        totalInserted += employeePermissions.length;
      }
    }
    
    console.log(`🎉 Total ${totalInserted} employee permissions berhasil ditambahkan!`);
    
    // Tampilkan ringkasan
    const summary = await knex('employeeHasPermissions')
      .select('employees.employee_name', 'permissions.permission_name', 'menus.menu_name')
      .leftJoin('employees', 'employeeHasPermissions.employee_id', 'employees.employee_id')
      .leftJoin('permissions', 'employeeHasPermissions.permission_id', 'permissions.permission_id')
      .leftJoin('menus', 'employeeHasPermissions.menu_id', 'menus.menu_id')
      .limit(10);
    
    console.log('📋 Sample data yang ditambahkan:');
    summary.forEach(row => {
      console.log(`  - ${row.employee_name} memiliki permission '${row.permission_name}' di menu '${row.menu_name}'`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting employee permissions:', error);
    throw error;
  }
};
