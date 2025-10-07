/**
 * Migration script to move data from users table to employees table
 * This script should be run before applying the migration that drops the users table
 */

const { pgCore } = require('../config/database');
const bcrypt = require('bcrypt');

async function migrateUsersToEmployees() {
  try {
    console.log('🚀 Starting migration from users to employees...');

    // Get all users with their employee data
    const users = await pgCore('users')
      .select([
        'users.user_id',
        'users.user_name',
        'users.user_email',
        'users.user_password',
        'users.role_id',
        'users.created_at',
        'users.created_by',
        'users.updated_at',
        'users.updated_by',
        'employees.employee_id',
        'employees.employee_name',
        'employees.employee_email',
        'employees.employee_exmail_account'
      ])
      .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
      .where('users.is_delete', false);

    console.log(`📊 Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      try {
        // Check if employee exists
        if (!user.employee_id) {
          console.log(`⚠️  Skipping user ${user.user_name} - no associated employee found`);
          skippedCount++;
          continue;
        }

        // Update employee with password and exmail account
        const updateData = {
          password: user.user_password,
          updated_at: new Date().toISOString(),
          updated_by: user.updated_by
        };

        // Set exmail account if not already set
        if (!user.employee_exmail_account && user.user_email) {
          updateData.employee_exmail_account = user.user_email;
        }

        await pgCore('employees')
          .where('employee_id', user.employee_id)
          .update(updateData);

        console.log(`✅ Migrated user: ${user.user_name} -> Employee: ${user.employee_name}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrating user ${user.user_name}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`⚠️  Skipped: ${skippedCount} users`);
    console.log(`📊 Total processed: ${users.length} users`);

    // Migrate role permissions to employee permissions
    console.log('\n🔄 Migrating role permissions to employee permissions...');
    
    const rolePermissions = await pgCore('roleHasMenuPermissions')
      .select([
        'roleHasMenuPermissions.role_id',
        'roleHasMenuPermissions.menu_id',
        'roleHasMenuPermissions.permission_id',
        'roleHasMenuPermissions.created_at',
        'roleHasMenuPermissions.created_by',
        'users.employee_id'
      ])
      .leftJoin('users', 'roleHasMenuPermissions.role_id', 'users.role_id')
      .where('users.is_delete', false);

    console.log(`📊 Found ${rolePermissions.length} role permissions to migrate`);

    let permissionMigratedCount = 0;
    let permissionSkippedCount = 0;

    for (const rolePermission of rolePermissions) {
      try {
        if (!rolePermission.employee_id) {
          console.log(`⚠️  Skipping role permission - no associated employee found`);
          permissionSkippedCount++;
          continue;
        }

        // Check if employee permission already exists
        const existingPermission = await pgCore('employeeHasPermissions')
          .where('employee_id', rolePermission.employee_id)
          .where('permission_id', rolePermission.permission_id)
          .first();

        if (existingPermission) {
          console.log(`⚠️  Employee permission already exists for employee ${rolePermission.employee_id}`);
          permissionSkippedCount++;
          continue;
        }

        // Create employee permission
        await pgCore('employeeHasPermissions').insert({
          employee_id: rolePermission.employee_id,
          permission_id: rolePermission.permission_id,
          created_at: rolePermission.created_at,
          created_by: rolePermission.created_by
        });

        console.log(`✅ Migrated permission for employee: ${rolePermission.employee_id}`);
        permissionMigratedCount++;

      } catch (error) {
        console.error(`❌ Error migrating permission:`, error.message);
        permissionSkippedCount++;
      }
    }

    console.log('\n📈 Permission Migration Summary:');
    console.log(`✅ Successfully migrated: ${permissionMigratedCount} permissions`);
    console.log(`⚠️  Skipped: ${permissionSkippedCount} permissions`);
    console.log(`📊 Total processed: ${rolePermissions.length} permissions`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('⚠️  Please review the data and run the migration to drop users and roleHasMenuPermissions tables');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateUsersToEmployees()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsersToEmployees };
