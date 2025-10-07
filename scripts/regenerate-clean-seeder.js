const fs = require('fs');
const path = require('path');

/**
 * Script untuk regenerate seeder dengan handling karakter khusus yang lebih baik
 */

function escapeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

function getEmbeddedCSVData() {
  // Sample data CSV - dalam production, ini akan berisi semua 682 baris
  return `NAMA,As Ochart,Segmentasi,Island,Dept,Job Title,Phone No,Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
Hu Jian,MSI,BOD,Java,BOD,President Director,,呼剑,HuJianeric,Hu Jian,BOD,President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Male,6281315977268,,,,hujianeric@motorsights.net,,Activated,,Not follow
Shen Shumeng (Sarah),MSI,BOD,Java,BOD,Vice President Director,,申舒萌,ShenShuMeng,Shen Shumeng (Sarah),BOD,Vice President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Female,6282213195555,,,"Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240",shenshumeng@motorsights.net,,Activated,,Not follow
Reny Ayu Chrisyanty,MSI,G4-SFCC,Java,SFCC,Finance Controller Supervisor,081210861552,Reny A_Jkt_MSI-IEC_FinCtrlSpv,renyayu,Reny Ayu Chrisyanty,,Finance Controller Supervisor,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance],Female,6281210861552,,renyayu30@gmail.com,TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121,renyayu@motorsights.net,,Activated,,Not follow
Ratno Hidayatulloh,MSI,G4-HCCA,Java,HCCA,"GA, Driver / Courier",083870063909,Ratno H_Jav_MSI-IEC_Courier,ratnohidayatulloh,Ratno Hidayatulloh,,Courier,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)],Male,6283899938232,,ratnohidayatulloh@indoequip.net,"Jl Ikhlas I No 39 Cip. Muara RT/RW 006/001 Cipinang Muara, Jatinegara",ratno_hidayatulloh@motorsights.net,,Activated,,Not follow
Agus Muharam,MSI,G4-HCCA,Java,HCCA,"GA, Driver / Courier",089611813334,Agus M_Jav_MSI-IEC_AssetMain&Adm,agusmuharram,Agus Muharam,,GA - Asset Maintenance and Admin,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)],Male,6289611813334,,agus.muharam@indoequip.net,"Jl Dahlia 2 No 40 RT 3 RW 5 Cakung Timur ,Cakung Kota Jakarta Timur ,DKI Jakarta 13910",agusmuharram@motorsights.net,,Activated,,Not follow
Asrullah,IEL-1,G2-SERVICE,Sulawesi,Service,Senior Engineer,081247516756,Asrullah_Sul_MSI-IEL_MidMech,asrullah,Asrullah,,Senior Enginer - STM,剑展MOTORSIGHTSINTERNATIONAL/销售后 (IEL)[EN:IEL AfterSales]/Technical[EN:Technical Support]/IEL Tecnical[EN:IEL-TS-Sulawesi]/After sales Sul/KDI Luwuk Morowali (Sul),Male,6281243883495,,asrullah@indoequip.net,"Bontotene RT003 RW002 Kel. Bilalang Kec. Manuju, Gowa",asrullah@id.indoequipservice.com,,Activated,,Not follow`;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] === ',' || inQuotes)) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.replace(/^"|"$/g, ''));
  return result;
}

function parseAndConvertCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const employeeData = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length - 3) {
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        // Convert to our format with escaped strings
        const employeeRecord = {
          nama: escapeString(row['NAMA'] || ''),
          asOchart: escapeString(row['As Ochart'] || ''),
          segmentasi: escapeString(row['Segmentasi'] || ''),
          island: escapeString(row['Island'] || ''),
          dept: escapeString(row['Dept'] || ''),
          jobTitle: escapeString(row['Job Title'] || ''),
          phoneNo: escapeString(row['Phone No'] || ''),
          name: escapeString(row['Name'] || ''),
          account: escapeString(row['Account'] || ''),
          alias: escapeString(row['Alias'] || ''),
          posisi: escapeString(row['Posisi (HR/GM/VP/BOD/PUB)'] || ''),
          title: escapeString(row['Title'] || ''),
          department: escapeString(row['Department'] || ''),
          gender: escapeString(row['Gender'] || ''),
          mobile: escapeString(row['Mobile'] || ''),
          officeNumber: escapeString(row['Office Number'] || ''),
          email: escapeString(row['E-mail'] || ''),
          address: escapeString(row['Address'] || ''),
          exmailAccount: escapeString(row['Exmail account'] || ''),
          channel: escapeString(row['Channel'] || ''),
          activationStatus: escapeString(row['Activation Status'] || ''),
          disabled: escapeString(row['Disabled'] || ''),
          wechatWorkplace: escapeString(row['WeChat Workplace'] || '')
        };
        
        employeeData.push(employeeRecord);
      }
    }
  }

  return employeeData;
}

function generateCleanSeederContent(employeeData) {
  // Manually create the array string to avoid JSON.stringify issues
  let employeeDataStr = '[\n';
  
  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i];
    employeeDataStr += '    {\n';
    employeeDataStr += `      nama: '${emp.nama}',\n`;
    employeeDataStr += `      asOchart: '${emp.asOchart}',\n`;
    employeeDataStr += `      segmentasi: '${emp.segmentasi}',\n`;
    employeeDataStr += `      island: '${emp.island}',\n`;
    employeeDataStr += `      dept: '${emp.dept}',\n`;
    employeeDataStr += `      jobTitle: '${emp.jobTitle}',\n`;
    employeeDataStr += `      phoneNo: '${emp.phoneNo}',\n`;
    employeeDataStr += `      name: '${emp.name}',\n`;
    employeeDataStr += `      account: '${emp.account}',\n`;
    employeeDataStr += `      alias: '${emp.alias}',\n`;
    employeeDataStr += `      posisi: '${emp.posisi}',\n`;
    employeeDataStr += `      title: '${emp.title}',\n`;
    employeeDataStr += `      department: '${emp.department}',\n`;
    employeeDataStr += `      gender: '${emp.gender}',\n`;
    employeeDataStr += `      mobile: '${emp.mobile}',\n`;
    employeeDataStr += `      officeNumber: '${emp.officeNumber}',\n`;
    employeeDataStr += `      email: '${emp.email}',\n`;
    employeeDataStr += `      address: '${emp.address}',\n`;
    employeeDataStr += `      exmailAccount: '${emp.exmailAccount}',\n`;
    employeeDataStr += `      channel: '${emp.channel}',\n`;
    employeeDataStr += `      activationStatus: '${emp.activationStatus}',\n`;
    employeeDataStr += `      disabled: '${emp.disabled}',\n`;
    employeeDataStr += `      wechatWorkplace: '${emp.wechatWorkplace}'\n`;
    employeeDataStr += '    }';
    
    if (i < employeeData.length - 1) {
      employeeDataStr += ',';
    }
    employeeDataStr += '\n';
  }
  
  employeeDataStr += '  ]';

  return `const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Clean Employee Data Seeder from CSV
 * Generated with proper escaping - ${employeeData.length} records
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Starting Clean Employee Data Seeder...');
    console.log('📊 Processing ${employeeData.length} employee records from CSV...');
    
    // Employee data from CSV (properly escaped)
    const employeeData = ${employeeDataStr};

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

    console.log(\`📋 Using role: \${defaultRole.role_name}\`);

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
        console.log(\`🏝️  Created island: \${cleanName}\`);
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
        console.log(\`👤 Created gender: \${cleanName}\`);
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
        console.log(\`🏢 Created company: \${cleanName}\`);
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
      const cacheKey = \`\${cleanName}|\${companyId}\`;
      
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
        console.log(\`🏭 Created department: \${cleanName} (Segmentasi: \${segmentasi || 'None'})\`);
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
      const cacheKey = \`\${cleanName}|\${departmentId}\`;
      
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
        console.log(\`💼 Created title: \${cleanName}\`);
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
          console.log(\`⚠️  Skipping employee \${i + 1}: Missing name\`);
          skippedCount++;
          continue;
        }

        const employeeEmail = emp.exmailAccount || emp.email || '';

        // Validasi duplikat email dalam batch ini
        if (employeeEmail && processedEmails.has(employeeEmail.toLowerCase())) {
          console.log(\`⚠️  Skipping duplicate email in batch: \${emp.nama} (\${employeeEmail})\`);
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
            console.log(\`⚠️  Skipping duplicate employee: \${emp.nama} (\${employeeEmail})\`);
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
            console.log(\`⚠️  Skipping duplicate user: \${emp.nama} (\${emp.exmailAccount})\`);
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
          console.log(\`📈 Progress: \${processedCount}/\${employeeData.length} employees processed\`);
        }

      } catch (error) {
        console.error(\`❌ Error processing employee \${emp.nama}:\`, error.message);
        errors.push({
          employee: emp.nama,
          error: error.message
        });
        skippedCount++;
      }
    }

    // Summary
    console.log('\\n📈 Import Summary:');
    console.log(\`✅ Successfully processed: \${processedCount} employees\`);
    console.log(\`👥 Users created: \${userCreatedCount}\`);
    console.log(\`⚠️  Skipped: \${skippedCount} employees\`);
    
    if (errors.length > 0) {
      console.log('\\n❌ Errors encountered:');
      errors.forEach(err => {
        console.log(\`   - \${err.employee}: \${err.error}\`);
      });
    }

    console.log('\\n🎉 Clean Employee Data Seeder completed successfully!');

  } catch (error) {
    console.error('❌ Clean Employee Seeder failed:', error);
    throw error;
  }
};`;
}

function regenerateCleanSeeder() {
  try {
    console.log('🔄 Regenerating clean seeder...');
    
    const csvData = getEmbeddedCSVData();
    const employeeData = parseAndConvertCSV(csvData);
    const seederContent = generateCleanSeederContent(employeeData);
    
    // Write new clean seeder file
    const seederPath = path.join(__dirname, '..', 'src', 'repository', 'postgres', 'seeders', '0014_clean_employee_data_seeder.js');
    fs.writeFileSync(seederPath, seederContent);
    
    console.log(`✅ Clean Employee Seeder created: ${seederPath}`);
    console.log(`📊 Total employees: ${employeeData.length}`);
    
    return employeeData;

  } catch (error) {
    console.error('❌ Error regenerating clean seeder:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  regenerateCleanSeeder();
}

module.exports = { regenerateCleanSeeder };
