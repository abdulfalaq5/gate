const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

/**
 * Full Employee Data Seeder from CSV
 * Seeder untuk mengimpor data karyawan lengkap dari CSV
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Full Employee Data seeder...');
    
    // Raw CSV data (first few rows as example)
    const csvData = [
      {
        nama: 'Hu Jian',
        asOchart: 'MSI',
        segmentasi: 'BOD',
        island: 'Java',
        dept: 'BOD',
        jobTitle: 'President Director',
        phoneNo: '',
        name: '呼剑',
        account: 'HuJianeric',
        alias: 'Hu Jian',
        posisi: 'BOD',
        title: 'President Director',
        department: '剑展MOTORSIGHTSINTERNATIONAL/BOD',
        gender: 'Male',
        mobile: '6281315977268',
        officeNumber: '',
        email: '',
        address: '',
        exmailAccount: 'hujianeric@motorsights.net',
        channel: '',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      },
      {
        nama: 'Shen Shumeng (Sarah)',
        asOchart: 'MSI',
        segmentasi: 'BOD',
        island: 'Java',
        dept: 'BOD',
        jobTitle: 'Vice President Director',
        phoneNo: '',
        name: '申舒萌',
        account: 'ShenShuMeng',
        alias: 'Shen Shumeng (Sarah)',
        posisi: 'BOD',
        title: 'Vice President Director',
        department: '剑展MOTORSIGHTSINTERNATIONAL/BOD',
        gender: 'Female',
        mobile: '6282213195555',
        officeNumber: '',
        email: '',
        address: 'Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240',
        exmailAccount: 'shenshumeng@motorsights.net',
        channel: '',
        activationStatus: 'Activated',
        disabled: '',
        wechatWorkplace: 'Not follow'
      }
      // Add more data here...
    ];

    // Get default role for users
    const defaultRole = await knex('roles')
      .where('role_name', 'Employee')
      .where('is_delete', false)
      .first();

    let roleId = null;
    if (!defaultRole) {
      const anyRole = await knex('roles')
        .where('is_delete', false)
        .first();
      
      if (!anyRole) {
        throw new Error('No roles found in database. Please ensure roles table has data.');
      }
      roleId = anyRole.role_id;
    } else {
      roleId = defaultRole.role_id;
    }

    console.log(`📋 Using role: ${defaultRole ? defaultRole.role_name : 'Default role'}`);

    // Helper function to get or create island
    const getOrCreateIsland = async (islandName) => {
      if (!islandName || !islandName.trim()) {
        return null;
      }
      
      const cleanIslandName = islandName.trim();
      
      let island = await knex('islands')
        .where('island_name', cleanIslandName)
        .where('is_delete', false)
        .first();
      
      if (!island) {
        const islandId = uuidv4();
        await knex('islands').insert({
          island_id: islandId,
          island_name: cleanIslandName,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏝️  Created island: ${cleanIslandName}`);
        return islandId;
      }
      
      return island.island_id;
    };

    // Helper function to get or create gender
    const getOrCreateGender = async (genderName) => {
      if (!genderName || !genderName.trim()) {
        return null;
      }
      
      const cleanGenderName = genderName.trim();
      
      let gender = await knex('genders')
        .where('gender_name', cleanGenderName)
        .where('is_delete', false)
        .first();
      
      if (!gender) {
        const genderId = uuidv4();
        await knex('genders').insert({
          gender_id: genderId,
          gender_name: cleanGenderName,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`👤 Created gender: ${cleanGenderName}`);
        return genderId;
      }
      
      return gender.gender_id;
    };

    // Helper function to get or create company
    const getOrCreateCompany = async (companyName) => {
      if (!companyName || !companyName.trim()) {
        return null;
      }
      
      const cleanCompanyName = companyName.trim();
      
      let company = await knex('companies')
        .where('company_name', cleanCompanyName)
        .where('is_delete', false)
        .first();
      
      if (!company) {
        const companyId = uuidv4();
        await knex('companies').insert({
          company_id: companyId,
          company_name: cleanCompanyName,
          company_parent_id: null,
          company_address: null,
          company_email: null,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏢 Created company: ${cleanCompanyName}`);
        return companyId;
      }
      
      return company.company_id;
    };

    // Helper function to get or create department
    const getOrCreateDepartment = async (departmentName, segmentasi, companyId) => {
      if (!departmentName || !departmentName.trim()) {
        return null;
      }
      
      const cleanDepartmentName = departmentName.trim();
      
      let department = await knex('departments')
        .where('department_name', cleanDepartmentName)
        .where('company_id', companyId)
        .where('is_delete', false)
        .first();
      
      if (!department) {
        const departmentId = uuidv4();
        await knex('departments').insert({
          department_id: departmentId,
          department_name: cleanDepartmentName,
          department_segmentasi: segmentasi || null,
          department_parent_id: null,
          company_id: companyId,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏭 Created department: ${cleanDepartmentName} (${segmentasi || 'No segmentation'})`);
        return departmentId;
      }
      
      return department.department_id;
    };

    // Helper function to get or create title
    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) {
        return null;
      }
      
      const cleanTitleName = titleName.trim();
      
      let title = await knex('titles')
        .where('title_name', cleanTitleName)
        .where('department_id', departmentId)
        .where('is_delete', false)
        .first();
      
      if (!title) {
        const titleId = uuidv4();
        await knex('titles').insert({
          title_id: titleId,
          title_name: cleanTitleName,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`💼 Created title: ${cleanTitleName}`);
        return titleId;
      }
      
      return title.title_id;
    };

    // Process employee data
    console.log('📊 Processing employee data...');
    
    let processedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const emp of csvData) {
      try {
        // Skip if essential data is missing
        if (!emp.nama || (!emp.account && !emp.exmailAccount)) {
          console.log(`⚠️  Skipping employee: ${emp.nama || 'Unknown'} - Missing essential data`);
          skippedCount++;
          continue;
        }

        // Check for duplicate employee by email
        const existingEmployee = await knex('employees')
          .where('employee_email', emp.exmailAccount || emp.email || '')
          .where('is_delete', false)
          .first();

        if (existingEmployee) {
          console.log(`⚠️  Skipping duplicate employee: ${emp.nama} (${emp.exmailAccount || emp.email})`);
          skippedCount++;
          continue;
        }

        // Check for duplicate user by email
        const existingUser = await knex('users')
          .where('user_email', emp.exmailAccount || emp.email || '')
          .where('is_delete', false)
          .first();

        if (existingUser) {
          console.log(`⚠️  Skipping duplicate user: ${emp.nama} (${emp.exmailAccount || emp.email})`);
          skippedCount++;
          continue;
        }

        // Get or create related entities
        const islandId = await getOrCreateIsland(emp.island);
        const genderId = await getOrCreateGender(emp.gender);
        const companyId = await getOrCreateCompany(emp.asOchart);
        const departmentId = await getOrCreateDepartment(emp.dept, emp.segmentasi, companyId);
        const titleId = await getOrCreateTitle(emp.jobTitle, departmentId);

        // Create employee
        const employeeId = uuidv4();
        await knex('employees').insert({
          employee_id: employeeId,
          employee_name: emp.nama,
          employee_email: emp.exmailAccount || emp.email || '',
          employee_phone: emp.phoneNo || null,
          employee_mobile: emp.mobile || null,
          employee_office_number: emp.officeNumber || null,
          employee_address: emp.address || null,
          employee_exmail_account: emp.exmailAccount || null,
          employee_channel: emp.channel || null,
          employee_activation_status: emp.activationStatus || null,
          employee_disabled: emp.disabled === 'TRUE' || emp.disabled === true,
          employee_wechat_workplace: emp.wechatWorkplace || null,
          title_id: titleId,
          gender_id: genderId,
          department_id: departmentId,
          island_id: islandId,
          created_by: null,
          created_at: new Date().toISOString()
        });

        // Create user if has exmail account
        if (emp.exmailAccount && emp.exmailAccount.trim()) {
          const userId = uuidv4();
          const hashedPassword = await bcrypt.hash('QwerMSI2025!', 10);
          
          await knex('users').insert({
            user_id: userId,
            employee_id: employeeId,
            role_id: roleId,
            user_name: emp.account || emp.alias || emp.nama,
            user_email: emp.exmailAccount,
            user_password: hashedPassword,
            created_by: null,
            created_at: new Date().toISOString()
          });
        }

        processedCount++;
        console.log(`✅ Processed: ${emp.nama} (${processedCount}/${csvData.length})`);

      } catch (error) {
        console.error(`❌ Error processing employee ${emp.nama}:`, error.message);
        errors.push({
          employee: emp.nama,
          error: error.message
        });
        skippedCount++;
      }
    }

    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully processed: ${processedCount} employees`);
    console.log(`⚠️  Skipped: ${skippedCount} employees`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(err => {
        console.log(`   - ${err.employee}: ${err.error}`);
      });
    }

    console.log('✅ Full Employee Data seeder completed!');

  } catch (error) {
    console.error('❌ Employee seeder failed:', error);
    throw error;
  }
};
