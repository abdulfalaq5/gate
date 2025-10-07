const fs = require('fs');
const path = require('path');

/**
 * Script untuk menghasilkan seeder lengkap dari data CSV karyawan
 */

// Data CSV lengkap dari file yang diberikan
const fullCsvData = `NAMA,As Ochart,Segmentasi,Island,Dept,Job Title,Phone No,Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
Hu Jian,MSI,BOD,Java,BOD,President Director,,呼剑,HuJianeric,Hu Jian,BOD,President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Male,6281315977268,,,,hujianeric@motorsights.net,,Activated,,Not follow
Shen Shumeng (Sarah),MSI,BOD,Java,BOD,Vice President Director,,申舒萌,ShenShuMeng,Shen Shumeng (Sarah),BOD,Vice President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Female,6282213195555,,,"Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240",shenshumeng@motorsights.net,,Activated,,Not follow
Reny Ayu Chrisyanty,MSI,G4-SFCC,Java,SFCC,Finance Controller Supervisor,081210861552,Reny A_Jkt_MSI-IEC_FinCtrlSpv,renyayu,Reny Ayu Chrisyanty,,Finance Controller Supervisor,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance],Female,6281210861552,,renyayu30@gmail.com,TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121,renyayu@motorsights.net,,Activated,,Not follow
Ratno Hidayatulloh,MSI,G4-HCCA,Java,HCCA,"GA, Driver / Courier",083870063909,Ratno H_Jav_MSI-IEC_Courier,ratnohidayatulloh,Ratno Hidayatulloh,,Courier,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)],Male,6283899938232,,ratnohidayatulloh@indoequip.net,"Jl Ikhlas I No 39 Cip. Muara RT/RW 006/001 Cipinang Muara, Jatinegara",ratno_hidayatulloh@motorsights.net,,Activated,,Not follow
Agus Muharam,MSI,G4-HCCA,Java,HCCA,"GA, Driver / Courier",089611813334,Agus M_Jav_MSI-IEC_AssetMain&Adm,agusmuharram,Agus Muharam,,GA - Asset Maintenance and Admin,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)],Male,6289611813334,,agus.muharam@indoequip.net,"Jl Dahlia 2 No 40 RT 3 RW 5 Cakung Timur ,Cakung Kota Jakarta Timur ,DKI Jakarta 13910",agusmuharram@motorsights.net,,Activated,,Not follow
Zubaedah,MSI,G4-HCCA,Java,HCCA,Nanny,081293300189,,,,,,,,,,,,,,,,
Feby Amelia Sulfianti,MSI,G4-SFCC,Java,SFCC,Finance & Leasing Manager,082113316552,Feby AS_Jkt_MSI-IEC_FinancingMgr,febyameliasulfianti,Feby Amelia Sulfianti,,Financing Supervisor,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/融资[EN:Financing],Female,6282113316552,,feby.a@indoequip.net,Jl Satria Ii No 66 Rt02/02 Ujung Menteng Cakung Jakart Timur,feby.a@motorsights.net,,Activated,,Not follow
Darusalam,MSI,G4-HCCA,Java,HCCA,Office Boy,0895332030910,Darusalam_Jav_MSI-IEC_OB,darusalam,Darusalam,,Office Boy,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/HR Operation/GA - 爪哇 (Jav)[EN:GA - Java (Jav)],Male,,,darusalam@indoequip.net,"Perum Villa Kencana RT 003 RW 008 Kel. Sukajadi Kec. Sukakarya Kab. Bekasi, Jawa Barat",darusalam@motorsights.net,,Activated,,Not follow
Pieter Ronald,MSI,G4-SUPPLY CHAIN,Java,Supply Chain,Head Supply Chain,082114062108,,,,,,,,,,,,,,,,
Fajar,MSI,G4-HCCA,Java,HCCA,Permit Staff,081284938419,Fajar_Jkt_MSI-IEC_LglPermit,fajar,Fajar,,Permit Staff,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/人资[EN:HCCA]/法律[EN:Legal],Male,6281284938419,,fajar@indoequip.net,"Jl. Bintara 1, RT 012 RW 002 No.37, Bekasi Barat",fajar@motorsights.net,,Activated,,Not follow`;

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

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length - 2) { // Allow some flexibility
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
      }
    }
  }

  return data;
}

function convertToEmployeeData(csvRow) {
  return {
    nama: csvRow['NAMA'] || '',
    asOchart: csvRow['As Ochart'] || '',
    segmentasi: csvRow['Segmentasi'] || '',
    island: csvRow['Island'] || '',
    dept: csvRow['Dept'] || '',
    jobTitle: csvRow['Job Title'] || '',
    phoneNo: csvRow['Phone No'] || '',
    name: csvRow['Name'] || '',
    account: csvRow['Account'] || '',
    alias: csvRow['Alias'] || '',
    posisi: csvRow['Posisi (HR/GM/VP/BOD/PUB)'] || '',
    title: csvRow['Title'] || '',
    department: csvRow['Department'] || '',
    gender: csvRow['Gender'] || '',
    mobile: csvRow['Mobile'] || '',
    officeNumber: csvRow['Office Number'] || '',
    email: csvRow['E-mail'] || '',
    address: csvRow['Address'] || '',
    exmailAccount: csvRow['Exmail account'] || '',
    channel: csvRow['Channel'] || '',
    activationStatus: csvRow['Activation Status'] || '',
    disabled: csvRow['Disabled'] || '',
    wechatWorkplace: csvRow['WeChat Workplace'] || ''
  };
}

function generateSeederContent(employeeData) {
  // Split data into chunks for better performance
  const chunkSize = 100;
  const chunks = [];
  for (let i = 0; i < employeeData.length; i += chunkSize) {
    chunks.push(employeeData.slice(i, i + chunkSize));
  }

  const employeeDataStr = JSON.stringify(employeeData, null, 2)
    .replace(/"/g, "'");

  return `const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Complete Employee Data Seeder from CSV
 * Generated from CSV data - ${employeeData.length} records
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Complete Employee Data seeder...');
    console.log('📊 Processing ${employeeData.length} employee records...');
    
    // Employee data from CSV
    const employeeData = ${employeeDataStr};

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
      console.log(\`📋 Using default role: \${anyRole.role_name}\`);
    } else {
      roleId = defaultRole.role_id;
      console.log(\`📋 Using Employee role: \${defaultRole.role_name}\`);
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
        console.log(\`🏝️  Created island: \${cleanIslandName}\`);
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
        console.log(\`👤 Created gender: \${cleanGenderName}\`);
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
        console.log(\`🏢 Created company: \${cleanCompanyName}\`);
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
      const cacheKey = \`\${cleanDepartmentName}|\${companyId}\`;
      
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
        console.log(\`🏭 Created department: \${cleanDepartmentName} (Segmentasi: \${segmentasi || 'None'})\`);
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
        console.log(\`🔄 Updated department segmentasi: \${cleanDepartmentName} -> \${segmentasi}\`);
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
      const cacheKey = \`\${cleanTitleName}|\${departmentId}\`;
      
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
        console.log(\`💼 Created title: \${cleanTitleName}\`);
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
          console.log(\`⚠️  Skipping employee: Missing name\`);
          skippedCount++;
          continue;
        }

        const employeeEmail = emp.exmailAccount || emp.email || '';

        // Check for duplicate employee by email (only if email exists)
        if (employeeEmail && processedEmails.has(employeeEmail)) {
          console.log(\`⚠️  Skipping duplicate email in current batch: \${emp.nama} (\${employeeEmail})\`);
          skippedCount++;
          continue;
        }

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
          
          processedEmails.add(employeeEmail);
        }

        // Check for duplicate user by email (only if exmail exists)
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

    console.log('\\n📈 Import Summary:');
    console.log(\`✅ Successfully processed: \${processedCount} employees\`);
    console.log(\`👥 Users created: \${userCreatedCount}\`);
    console.log(\`⚠️  Skipped: \${skippedCount} employees\`);
    
    if (errors.length > 0) {
      console.log('\\n❌ Errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(\`   - \${err.employee}: \${err.error}\`);
      });
      
      if (errors.length > 10) {
        console.log(\`   ... and \${errors.length - 10} more errors\`);
      }
    }

    console.log('✅ Complete Employee Data seeder finished!');

  } catch (error) {
    console.error('❌ Employee seeder failed:', error);
    throw error;
  }
};`;
}

function generateSeederFile() {
  try {
    console.log('🔄 Processing CSV data...');
    
    // Parse CSV data
    const parsedData = parseCSV(fullCsvData);
    console.log(`📊 Parsed ${parsedData.length} rows from CSV`);

    // Convert to employee data format
    const employeeData = parsedData.map(convertToEmployeeData);
    
    console.log(`📋 Generated ${employeeData.length} employee records`);
    
    // Generate seeder content
    const seederContent = generateSeederContent(employeeData);
    
    // Write seeder file
    const seederPath = path.join(__dirname, '..', 'src', 'repository', 'postgres', 'seeders', '0012_complete_employee_data_from_csv.js');
    fs.writeFileSync(seederPath, seederContent);
    
    console.log(`✅ Seeder file created: ${seederPath}`);
    console.log(`📊 Total employees: ${employeeData.length}`);
    
    // Also create a JSON file for debugging
    const jsonPath = path.join(__dirname, 'employee_data_debug.json');
    fs.writeFileSync(jsonPath, JSON.stringify(employeeData, null, 2));
    console.log(`📄 Debug JSON created: ${jsonPath}`);
    
    return employeeData;

  } catch (error) {
    console.error('❌ Error generating seeder:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateSeederFile();
}

module.exports = {
  generateSeederFile,
  parseCSV,
  convertToEmployeeData
};
