const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Complete Employee Data Seeder from CSV
 * Generated from CSV data - 10 records
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Complete Employee Data seeder...');
    console.log('📊 Processing 10 employee records...');
    
    // Employee data from CSV
    const employeeData = [
  {
    'nama': 'Hu Jian',
    'asOchart': 'MSI',
    'segmentasi': 'BOD',
    'island': 'Java',
    'dept': 'BOD',
    'jobTitle': 'President Director',
    'phoneNo': '',
    'name': '呼剑',
    'account': 'HuJianeric',
    'alias': 'Hu Jian',
    'posisi': 'BOD',
    'title': 'President Director',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/BOD',
    'gender': 'Male',
    'mobile': '6281315977268',
    'officeNumber': '',
    'email': '',
    'address': '',
    'exmailAccount': 'hujianeric@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Shen Shumeng (Sarah)',
    'asOchart': 'MSI',
    'segmentasi': 'BOD',
    'island': 'Java',
    'dept': 'BOD',
    'jobTitle': 'Vice President Director',
    'phoneNo': '',
    'name': '申舒萌',
    'account': 'ShenShuMeng',
    'alias': 'Shen Shumeng (Sarah)',
    'posisi': 'BOD',
    'title': 'Vice President Director',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/BOD',
    'gender': 'Female',
    'mobile': '6282213195555',
    'officeNumber': '',
    'email': '',
    'address': 'Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240',
    'exmailAccount': 'shenshumeng@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Reny Ayu Chrisyanty',
    'asOchart': 'MSI',
    'segmentasi': 'G4-SFCC',
    'island': 'Java',
    'dept': 'SFCC',
    'jobTitle': 'Finance Controller Supervisor',
    'phoneNo': '081210861552',
    'name': 'Reny A_Jkt_MSI-IEC_FinCtrlSpv',
    'account': 'renyayu',
    'alias': 'Reny Ayu Chrisyanty',
    'posisi': '',
    'title': 'Finance Controller Supervisor',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance]',
    'gender': 'Female',
    'mobile': '6281210861552',
    'officeNumber': '',
    'email': 'renyayu30@gmail.com',
    'address': 'TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121',
    'exmailAccount': 'renyayu@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Ratno Hidayatulloh',
    'asOchart': 'MSI',
    'segmentasi': 'G4-HCCA',
    'island': 'Java',
    'dept': 'HCCA',
    'jobTitle': 'GA, Driver / Courier',
    'phoneNo': '083870063909',
    'name': 'Ratno H_Jav_MSI-IEC_Courier',
    'account': 'ratnohidayatulloh',
    'alias': 'Ratno Hidayatulloh',
    'posisi': '',
    'title': 'Courier',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)]',
    'gender': 'Male',
    'mobile': '6283899938232',
    'officeNumber': '',
    'email': 'ratnohidayatulloh@indoequip.net',
    'address': 'Jl Ikhlas I No 39 Cip. Muara RT/RW 006/001 Cipinang Muara, Jatinegara',
    'exmailAccount': 'ratno_hidayatulloh@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Agus Muharam',
    'asOchart': 'MSI',
    'segmentasi': 'G4-HCCA',
    'island': 'Java',
    'dept': 'HCCA',
    'jobTitle': 'GA, Driver / Courier',
    'phoneNo': '089611813334',
    'name': 'Agus M_Jav_MSI-IEC_AssetMain&Adm',
    'account': 'agusmuharram',
    'alias': 'Agus Muharam',
    'posisi': '',
    'title': 'GA - Asset Maintenance and Admin',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)]',
    'gender': 'Male',
    'mobile': '6289611813334',
    'officeNumber': '',
    'email': 'agus.muharam@indoequip.net',
    'address': 'Jl Dahlia 2 No 40 RT 3 RW 5 Cakung Timur ,Cakung Kota Jakarta Timur ,DKI Jakarta 13910',
    'exmailAccount': 'agusmuharram@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Zubaedah',
    'asOchart': 'MSI',
    'segmentasi': 'G4-HCCA',
    'island': 'Java',
    'dept': 'HCCA',
    'jobTitle': 'Nanny',
    'phoneNo': '081293300189',
    'name': '',
    'account': '',
    'alias': '',
    'posisi': '',
    'title': '',
    'department': '',
    'gender': '',
    'mobile': '',
    'officeNumber': '',
    'email': '',
    'address': '',
    'exmailAccount': '',
    'channel': '',
    'activationStatus': '',
    'disabled': '',
    'wechatWorkplace': ''
  },
  {
    'nama': 'Feby Amelia Sulfianti',
    'asOchart': 'MSI',
    'segmentasi': 'G4-SFCC',
    'island': 'Java',
    'dept': 'SFCC',
    'jobTitle': 'Finance & Leasing Manager',
    'phoneNo': '082113316552',
    'name': 'Feby AS_Jkt_MSI-IEC_FinancingMgr',
    'account': 'febyameliasulfianti',
    'alias': 'Feby Amelia Sulfianti',
    'posisi': '',
    'title': 'Financing Supervisor',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/融资[EN:Financing]',
    'gender': 'Female',
    'mobile': '6282113316552',
    'officeNumber': '',
    'email': 'feby.a@indoequip.net',
    'address': 'Jl Satria Ii No 66 Rt02/02 Ujung Menteng Cakung Jakart Timur',
    'exmailAccount': 'feby.a@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Darusalam',
    'asOchart': 'MSI',
    'segmentasi': 'G4-HCCA',
    'island': 'Java',
    'dept': 'HCCA',
    'jobTitle': 'Office Boy',
    'phoneNo': '0895332030910',
    'name': 'Darusalam_Jav_MSI-IEC_OB',
    'account': 'darusalam',
    'alias': 'Darusalam',
    'posisi': '',
    'title': 'Office Boy',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)]',
    'gender': 'Male',
    'mobile': '',
    'officeNumber': '',
    'email': 'darusalam@indoequip.net',
    'address': 'Perum Villa Kencana RT 003 RW 008 Kel. Sukajadi Kec. Sukakarya Kab. Bekasi, Jawa Barat',
    'exmailAccount': 'darusalam@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  },
  {
    'nama': 'Pieter Ronald',
    'asOchart': 'MSI',
    'segmentasi': 'G4-SUPPLY CHAIN',
    'island': 'Java',
    'dept': 'Supply Chain',
    'jobTitle': 'Head Supply Chain',
    'phoneNo': '082114062108',
    'name': '',
    'account': '',
    'alias': '',
    'posisi': '',
    'title': '',
    'department': '',
    'gender': '',
    'mobile': '',
    'officeNumber': '',
    'email': '',
    'address': '',
    'exmailAccount': '',
    'channel': '',
    'activationStatus': '',
    'disabled': '',
    'wechatWorkplace': ''
  },
  {
    'nama': 'Fajar',
    'asOchart': 'MSI',
    'segmentasi': 'G4-HCCA',
    'island': 'Java',
    'dept': 'HCCA',
    'jobTitle': 'Permit Staff',
    'phoneNo': '081284938419',
    'name': 'Fajar_Jkt_MSI-IEC_LglPermit',
    'account': 'fajar',
    'alias': 'Fajar',
    'posisi': '',
    'title': 'Permit Staff',
    'department': '剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/法律[EN:Legal]',
    'gender': 'Male',
    'mobile': '6281284938419',
    'officeNumber': '',
    'email': 'fajar@indoequip.net',
    'address': 'Jl. Bintara 1, RT 012 RW 002 No.37, Bekasi Barat',
    'exmailAccount': 'fajar@motorsights.net',
    'channel': '',
    'activationStatus': 'Activated',
    'disabled': '',
    'wechatWorkplace': 'Not follow'
  }
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
      console.log(`📋 Using default role: ${anyRole.role_name}`);
    } else {
      roleId = defaultRole.role_id;
      console.log(`📋 Using Employee role: ${defaultRole.role_name}`);
    }

    // Cache for created entities to avoid duplicates
    const islandCache = new Map();
    const genderCache = new Map();
    const companyCache = new Map();
    const departmentCache = new Map();
    const titleCache = new Map();

    // Helper function to get or create island
    const getOrCreateIsland = async (islandName) => {
      if (!islandName || !islandName.trim()) {
        return null;
      }
      
      const cleanIslandName = islandName.trim();
      
      if (islandCache.has(cleanIslandName)) {
        return islandCache.get(cleanIslandName);
      }
      
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
        islandCache.set(cleanIslandName, islandId);
        return islandId;
      }
      
      islandCache.set(cleanIslandName, island.island_id);
      return island.island_id;
    };

    // Helper function to get or create gender
    const getOrCreateGender = async (genderName) => {
      if (!genderName || !genderName.trim()) {
        return null;
      }
      
      const cleanGenderName = genderName.trim();
      
      if (genderCache.has(cleanGenderName)) {
        return genderCache.get(cleanGenderName);
      }
      
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
        genderCache.set(cleanGenderName, genderId);
        return genderId;
      }
      
      genderCache.set(cleanGenderName, gender.gender_id);
      return gender.gender_id;
    };

    // Helper function to get or create company
    const getOrCreateCompany = async (companyName) => {
      if (!companyName || !companyName.trim()) {
        // Get default company if no company name provided
        const defaultCompany = await knex('companies')
          .where('is_delete', false)
          .first();
        
        if (!defaultCompany) {
          throw new Error('No companies found. Please ensure companies table has data.');
        }
        
        return defaultCompany.company_id;
      }
      
      const cleanCompanyName = companyName.trim();
      
      if (companyCache.has(cleanCompanyName)) {
        return companyCache.get(cleanCompanyName);
      }
      
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
        companyCache.set(cleanCompanyName, companyId);
        return companyId;
      }
      
      companyCache.set(cleanCompanyName, company.company_id);
      return company.company_id;
    };

    // Helper function to get or create department
    const getOrCreateDepartment = async (departmentName, segmentasi, companyId) => {
      if (!departmentName || !departmentName.trim()) {
        return null;
      }
      
      const cleanDepartmentName = departmentName.trim();
      const cacheKey = `${cleanDepartmentName}|${companyId}`;
      
      if (departmentCache.has(cacheKey)) {
        return departmentCache.get(cacheKey);
      }
      
      // Check for existing department with same name and company
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
        console.log(`🏭 Created department: ${cleanDepartmentName} (Segmentasi: ${segmentasi || 'None'})`);
        departmentCache.set(cacheKey, departmentId);
        return departmentId;
      }
      
      // Update segmentasi if provided and different
      if (segmentasi && department.department_segmentasi !== segmentasi) {
        await knex('departments')
          .where('department_id', department.department_id)
          .update({
            department_segmentasi: segmentasi,
            updated_at: new Date().toISOString()
          });
        console.log(`🔄 Updated department segmentasi: ${cleanDepartmentName} -> ${segmentasi}`);
      }
      
      departmentCache.set(cacheKey, department.department_id);
      return department.department_id;
    };

    // Helper function to get or create title
    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) {
        return null;
      }
      
      const cleanTitleName = titleName.trim();
      const cacheKey = `${cleanTitleName}|${departmentId}`;
      
      if (titleCache.has(cacheKey)) {
        return titleCache.get(cacheKey);
      }
      
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

    for (const emp of employeeData) {
      try {
        // Skip if essential data is missing
        if (!emp.nama || emp.nama.trim() === '') {
          console.log(`⚠️  Skipping employee: Missing name`);
          skippedCount++;
          continue;
        }

        const employeeEmail = emp.exmailAccount || emp.email || '';

        // Check for duplicate employee by email (only if email exists)
        if (employeeEmail && processedEmails.has(employeeEmail)) {
          console.log(`⚠️  Skipping duplicate email in current batch: ${emp.nama} (${employeeEmail})`);
          skippedCount++;
          continue;
        }

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
          
          processedEmails.add(employeeEmail);
        }

        // Check for duplicate user by email (only if exmail exists)
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
          
          userCreatedCount++;
        }

        processedCount++;
        
        if (processedCount % 50 === 0) {
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

    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully processed: ${processedCount} employees`);
    console.log(`👥 Users created: ${userCreatedCount}`);
    console.log(`⚠️  Skipped: ${skippedCount} employees`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.employee}: ${err.error}`);
      });
      
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

    console.log('✅ Complete Employee Data seeder finished!');

  } catch (error) {
    console.error('❌ Employee seeder failed:', error);
    throw error;
  }
};