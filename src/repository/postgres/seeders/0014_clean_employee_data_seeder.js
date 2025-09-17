const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Clean Employee Data Seeder from CSV
 * Generated with proper escaping - 6 records
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Starting Clean Employee Data Seeder...');
    console.log('📊 Processing 6 employee records from CSV...');
    
    // Employee data from CSV (properly escaped)
    const employeeData = [
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
    },
    {
      nama: 'Reny Ayu Chrisyanty',
      asOchart: 'MSI',
      segmentasi: 'G4-SFCC',
      island: 'Java',
      dept: 'SFCC',
      jobTitle: 'Finance Controller Supervisor',
      phoneNo: '081210861552',
      name: 'Reny A_Jkt_MSI-IEC_FinCtrlSpv',
      account: 'renyayu',
      alias: 'Reny Ayu Chrisyanty',
      posisi: '',
      title: 'Finance Controller Supervisor',
      department: '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance]',
      gender: 'Female',
      mobile: '6281210861552',
      officeNumber: '',
      email: 'renyayu30@gmail.com',
      address: 'TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121',
      exmailAccount: 'renyayu@motorsights.net',
      channel: '',
      activationStatus: 'Activated',
      disabled: '',
      wechatWorkplace: 'Not follow'
    },
    {
      nama: 'Ratno Hidayatulloh',
      asOchart: 'MSI',
      segmentasi: 'G4-HCCA',
      island: 'Java',
      dept: 'HCCA',
      jobTitle: 'GA, Driver / Courier',
      phoneNo: '083870063909',
      name: 'Ratno H_Jav_MSI-IEC_Courier',
      account: 'ratnohidayatulloh',
      alias: 'Ratno Hidayatulloh',
      posisi: '',
      title: 'Courier',
      department: '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)]',
      gender: 'Male',
      mobile: '6283899938232',
      officeNumber: '',
      email: 'ratnohidayatulloh@indoequip.net',
      address: 'Jl Ikhlas I No 39 Cip. Muara RT/RW 006/001 Cipinang Muara, Jatinegara',
      exmailAccount: 'ratno_hidayatulloh@motorsights.net',
      channel: '',
      activationStatus: 'Activated',
      disabled: '',
      wechatWorkplace: 'Not follow'
    },
    {
      nama: 'Agus Muharam',
      asOchart: 'MSI',
      segmentasi: 'G4-HCCA',
      island: 'Java',
      dept: 'HCCA',
      jobTitle: 'GA, Driver / Courier',
      phoneNo: '089611813334',
      name: 'Agus M_Jav_MSI-IEC_AssetMain&Adm',
      account: 'agusmuharram',
      alias: 'Agus Muharam',
      posisi: '',
      title: 'GA - Asset Maintenance and Admin',
      department: '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)]',
      gender: 'Male',
      mobile: '6289611813334',
      officeNumber: '',
      email: 'agus.muharam@indoequip.net',
      address: 'Jl Dahlia 2 No 40 RT 3 RW 5 Cakung Timur ,Cakung Kota Jakarta Timur ,DKI Jakarta 13910',
      exmailAccount: 'agusmuharram@motorsights.net',
      channel: '',
      activationStatus: 'Activated',
      disabled: '',
      wechatWorkplace: 'Not follow'
    },
    {
      nama: 'Asrullah',
      asOchart: 'IEL-1',
      segmentasi: 'G2-SERVICE',
      island: 'Sulawesi',
      dept: 'Service',
      jobTitle: 'Senior Engineer',
      phoneNo: '081247516756',
      name: 'Asrullah_Sul_MSI-IEL_MidMech',
      account: 'asrullah',
      alias: 'Asrullah',
      posisi: '',
      title: 'Senior Enginer - STM',
      department: '剑展MOTORSIGHTSINTERNATIONAL/销售后 (IEL)[EN:IEL AfterSales]/Technical[EN:Technical Support]/IEL Tecnical[EN:IEL-TS-Sulawesi]/After sales Sul/KDI Luwuk Morowali (Sul)',
      gender: 'Male',
      mobile: '6281243883495',
      officeNumber: '',
      email: 'asrullah@indoequip.net',
      address: 'Bontotene RT003 RW002 Kel. Bilalang Kec. Manuju, Gowa',
      exmailAccount: 'asrullah@id.indoequipservice.com',
      channel: '',
      activationStatus: 'Activated',
      disabled: '',
      wechatWorkplace: 'Not follow'
    }
  ];

    // Get default role for users
    let defaultRole = await knex('roles')
      .where('role_name', 'Employee')
      .where('is_delete', false)
      .first();

    if (!defaultRole) {
      defaultRole = await knex('roles')
        .where('is_delete', false)
        .first();
      
      if (!defaultRole) {
        throw new Error('No roles found in database. Please ensure roles table has data.');
      }
    }

    console.log(`📋 Using role: ${defaultRole.role_name}`);

    // Cache untuk menghindari duplikasi query
    const islandCache = new Map();
    const genderCache = new Map();
    const companyCache = new Map();
    const departmentCache = new Map();
    const titleCache = new Map();

    // Helper function: Get or create island
    const getOrCreateIsland = async (islandName) => {
      if (!islandName || !islandName.trim()) {
        return null;
      }
      
      const cleanName = islandName.trim();
      
      if (islandCache.has(cleanName)) {
        return islandCache.get(cleanName);
      }
      
      let island = await knex('islands')
        .where('island_name', cleanName)
        .where('is_delete', false)
        .first();
      
      if (!island) {
        const islandId = uuidv4();
        await knex('islands').insert({
          island_id: islandId,
          island_name: cleanName,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏝️  Created island: ${cleanName}`);
        islandCache.set(cleanName, islandId);
        return islandId;
      }
      
      islandCache.set(cleanName, island.island_id);
      return island.island_id;
    };

    // Helper function: Get or create gender
    const getOrCreateGender = async (genderName) => {
      if (!genderName || !genderName.trim()) {
        return null;
      }
      
      const cleanName = genderName.trim();
      
      if (genderCache.has(cleanName)) {
        return genderCache.get(cleanName);
      }
      
      let gender = await knex('genders')
        .where('gender_name', cleanName)
        .where('is_delete', false)
        .first();
      
      if (!gender) {
        const genderId = uuidv4();
        await knex('genders').insert({
          gender_id: genderId,
          gender_name: cleanName,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`👤 Created gender: ${cleanName}`);
        genderCache.set(cleanName, genderId);
        return genderId;
      }
      
      genderCache.set(cleanName, gender.gender_id);
      return gender.gender_id;
    };

    // Helper function: Get or create company
    const getOrCreateCompany = async (companyName) => {
      if (!companyName || !companyName.trim()) {
        // Get default company
        const defaultCompany = await knex('companies')
          .where('is_delete', false)
          .first();
        
        if (!defaultCompany) {
          throw new Error('No companies found. Please ensure companies table has data.');
        }
        
        return defaultCompany.company_id;
      }
      
      const cleanName = companyName.trim();
      
      if (companyCache.has(cleanName)) {
        return companyCache.get(cleanName);
      }
      
      let company = await knex('companies')
        .where('company_name', cleanName)
        .where('is_delete', false)
        .first();
      
      if (!company) {
        const companyId = uuidv4();
        await knex('companies').insert({
          company_id: companyId,
          company_name: cleanName,
          company_parent_id: null,
          company_address: null,
          company_email: null,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏢 Created company: ${cleanName}`);
        companyCache.set(cleanName, companyId);
        return companyId;
      }
      
      companyCache.set(cleanName, company.company_id);
      return company.company_id;
    };

    // Helper function: Get or create department
    const getOrCreateDepartment = async (departmentName, segmentasi, companyId) => {
      if (!departmentName || !departmentName.trim()) {
        return null;
      }
      
      const cleanName = departmentName.trim();
      const cacheKey = `${cleanName}|${companyId}`;
      
      if (departmentCache.has(cacheKey)) {
        return departmentCache.get(cacheKey);
      }
      
      let department = await knex('departments')
        .where('department_name', cleanName)
        .where('company_id', companyId)
        .where('is_delete', false)
        .first();
      
      if (!department) {
        const departmentId = uuidv4();
        await knex('departments').insert({
          department_id: departmentId,
          department_name: cleanName,
          department_segmentasi: segmentasi || null,
          department_parent_id: null,
          company_id: companyId,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`🏭 Created department: ${cleanName} (Segmentasi: ${segmentasi || 'None'})`);
        departmentCache.set(cacheKey, departmentId);
        return departmentId;
      }
      
      // Update segmentasi jika berbeda
      if (segmentasi && department.department_segmentasi !== segmentasi) {
        await knex('departments')
          .where('department_id', department.department_id)
          .update({
            department_segmentasi: segmentasi,
            updated_at: new Date().toISOString()
          });
      }
      
      departmentCache.set(cacheKey, department.department_id);
      return department.department_id;
    };

    // Helper function: Get or create title
    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) {
        return null;
      }
      
      const cleanName = titleName.trim();
      const cacheKey = `${cleanName}|${departmentId}`;
      
      if (titleCache.has(cacheKey)) {
        return titleCache.get(cacheKey);
      }
      
      let title = await knex('titles')
        .where('title_name', cleanName)
        .where('department_id', departmentId)
        .where('is_delete', false)
        .first();
      
      if (!title) {
        const titleId = uuidv4();
        await knex('titles').insert({
          title_id: titleId,
          title_name: cleanName,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        });
        console.log(`💼 Created title: ${cleanName}`);
        titleCache.set(cacheKey, titleId);
        return titleId;
      }
      
      titleCache.set(cacheKey, title.title_id);
      return title.title_id;
    };

    // Process employee data
    console.log('📊 Processing employee data...');
    
    let processedCount = 0;
    let skippedCount = 0;
    let userCreatedCount = 0;
    const errors = [];
    const processedEmails = new Set();

    for (let i = 0; i < employeeData.length; i++) {
      const emp = employeeData[i];
      
      try {
        // Skip jika nama kosong
        if (!emp.nama || emp.nama.trim() === '') {
          console.log(`⚠️  Skipping employee ${i + 1}: Missing name`);
          skippedCount++;
          continue;
        }

        const employeeEmail = emp.exmailAccount || emp.email || '';

        // Validasi duplikat email dalam batch ini
        if (employeeEmail && processedEmails.has(employeeEmail.toLowerCase())) {
          console.log(`⚠️  Skipping duplicate email in batch: ${emp.nama} (${employeeEmail})`);
          skippedCount++;
          continue;
        }

        // Validasi duplikat employee di database
        if (employeeEmail) {
          const existingEmployee = await knex('employees')
            .where('employee_email', employeeEmail)
            .where('is_delete', false)
            .first();

          if (existingEmployee) {
            console.log(`⚠️  Skipping duplicate employee: ${emp.nama} (${employeeEmail})`);
            skippedCount++;
            continue;
          }
          
          processedEmails.add(employeeEmail.toLowerCase());
        }

        // Validasi duplikat user di database
        if (emp.exmailAccount && emp.exmailAccount.trim()) {
          const existingUser = await knex('users')
            .where('user_email', emp.exmailAccount)
            .where('is_delete', false)
            .first();

          if (existingUser) {
            console.log(`⚠️  Skipping duplicate user: ${emp.nama} (${emp.exmailAccount})`);
            skippedCount++;
            continue;
          }
        }

        // Get or create related entities
        const islandId = await getOrCreateIsland(emp.island);
        const genderId = await getOrCreateGender(emp.gender);
        const companyId = await getOrCreateCompany(emp.asOchart);
        const departmentId = await getOrCreateDepartment(emp.dept, emp.segmentasi, companyId);
        const titleId = await getOrCreateTitle(emp.jobTitle || emp.title, departmentId);

        // Create employee
        const employeeId = uuidv4();
        await knex('employees').insert({
          employee_id: employeeId,
          employee_name: emp.nama,
          employee_email: employeeEmail,
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

        // Create user jika ada exmail account
        if (emp.exmailAccount && emp.exmailAccount.trim()) {
          const userId = uuidv4();
          const hashedPassword = await bcrypt.hash('QwerMSI2025!', 10);
          
          await knex('users').insert({
            user_id: userId,
            employee_id: employeeId,
            role_id: defaultRole.role_id,
            user_name: emp.account || emp.alias || emp.nama,
            user_email: emp.exmailAccount,
            user_password: hashedPassword,
            created_by: null,
            created_at: new Date().toISOString()
          });
          
          userCreatedCount++;
        }

        processedCount++;
        
        // Progress update setiap 10 records untuk sample data
        if (processedCount % 10 === 0) {
          console.log(`📈 Progress: ${processedCount}/${employeeData.length} employees processed`);
        }

      } catch (error) {
        console.error(`❌ Error processing employee ${emp.nama}:`, error.message);
        errors.push({
          employee: emp.nama,
          error: error.message
        });
        skippedCount++;
      }
    }

    // Summary
    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully processed: ${processedCount} employees`);
    console.log(`👥 Users created: ${userCreatedCount}`);
    console.log(`⚠️  Skipped: ${skippedCount} employees`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(err => {
        console.log(`   - ${err.employee}: ${err.error}`);
      });
    }

    console.log('\n🎉 Clean Employee Data Seeder completed successfully!');

  } catch (error) {
    console.error('❌ Clean Employee Seeder failed:', error);
    throw error;
  }
};