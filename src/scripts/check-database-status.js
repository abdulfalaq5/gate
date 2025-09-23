/**
 * Script to check database status after migration
 */

const { pgCore } = require('../config/database');

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Checking database status after migration...\n');

    // Check employees table
    const employeeCount = await pgCore('employees').count('* as count').first();
    console.log(`📊 Total employees: ${employeeCount.count}`);

    // Check employees with password
    const employeesWithPassword = await pgCore('employees')
      .whereNotNull('password')
      .count('* as count')
      .first();
    console.log(`🔐 Employees with password: ${employeesWithPassword.count}`);

    // Check employees with exmail account
    const employeesWithExmail = await pgCore('employees')
      .whereNotNull('employee_exmail_account')
      .count('* as count')
      .first();
    console.log(`📧 Employees with exmail account: ${employeesWithExmail.count}`);

    // Check employeeHasPermissions table
    const permissionCount = await pgCore('employeeHasPermissions').count('* as count').first();
    console.log(`🔑 Total employee permissions: ${permissionCount.count}`);

    // Check SSO tables
    const ssoAuthCodes = await pgCore('sso_authorization_codes').count('* as count').first();
    console.log(`🔐 SSO authorization codes: ${ssoAuthCodes.count}`);

    const ssoSessions = await pgCore('sso_sessions').count('* as count').first();
    console.log(`📱 SSO sessions: ${ssoSessions.count}`);

    const ssoBlacklist = await pgCore('sso_token_blacklist').count('* as count').first();
    console.log(`🚫 SSO token blacklist: ${ssoBlacklist.count}`);

    // Check if users table exists
    try {
      await pgCore('users').count('* as count').first();
      console.log('⚠️  Users table still exists!');
    } catch (error) {
      console.log('✅ Users table successfully removed');
    }

    // Check if roleHasMenuPermissions table exists
    try {
      await pgCore('roleHasMenuPermissions').count('* as count').first();
      console.log('⚠️  roleHasMenuPermissions table still exists!');
    } catch (error) {
      console.log('✅ roleHasMenuPermissions table successfully removed');
    }

    console.log('\n🎉 Database status check completed!');

  } catch (error) {
    console.error('❌ Error checking database status:', error);
    throw error;
  }
}

// Run check if called directly
if (require.main === module) {
  checkDatabaseStatus()
    .then(() => {
      console.log('✅ Database status check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database status check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseStatus };
