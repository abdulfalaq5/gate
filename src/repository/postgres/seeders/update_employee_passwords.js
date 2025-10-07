const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  console.log('🔄 Memulai update password employees...');
  
  try {
    // Hash password baru
    const newPassword = 'QwerMSI2025!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password untuk semua employees
    const updatedCount = await knex('employees')
      .whereNotNull('employee_exmail_account')
      .where('is_delete', false)
      .update({
        password: hashedPassword,
        updated_at: knex.fn.now()
      });
    
    console.log(`✅ Berhasil update password untuk ${updatedCount} employees`);
    
    // Tampilkan daftar employees yang diupdate
    const employees = await knex('employees')
      .select('employee_name', 'employee_exmail_account')
      .whereNotNull('employee_exmail_account')
      .where('is_delete', false);
    
    console.log('📋 Daftar employees yang diupdate:');
    employees.forEach(emp => {
      console.log(`  - ${emp.employee_name} (${emp.employee_exmail_account})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating employee passwords:', error);
    throw error;
  }
};
