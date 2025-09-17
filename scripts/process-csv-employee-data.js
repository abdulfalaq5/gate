const fs = require('fs');
const path = require('path');

/**
 * Script untuk memproses data CSV karyawan dan menghasilkan seeder
 */

const csvData = `NAMA,As Ochart,Segmentasi,Island,Dept,Job Title,Phone No,Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
Hu Jian,MSI,BOD,Java,BOD,President Director,,呼剑,HuJianeric,Hu Jian,BOD,President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Male,6281315977268,,,,hujianeric@motorsights.net,,Activated,,Not follow
Shen Shumeng (Sarah),MSI,BOD,Java,BOD,Vice President Director,,申舒萌,ShenShuMeng,Shen Shumeng (Sarah),BOD,Vice President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Female,6282213195555,,,"Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240",shenshumeng@motorsights.net,,Activated,,Not follow
Reny Ayu Chrisyanty,MSI,G4-SFCC,Java,SFCC,Finance Controller Supervisor,081210861552,Reny A_Jkt_MSI-IEC_FinCtrlSpv,renyayu,Reny Ayu Chrisyanty,,Finance Controller Supervisor,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance],Female,6281210861552,,renyayu30@gmail.com,TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121,renyayu@motorsights.net,,Activated,,Not follow`;

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }
  }

  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
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

function generateSeederFile() {
  try {
    console.log('🔄 Processing CSV data...');
    
    // Parse CSV data
    const parsedData = parseCSV(csvData);
    console.log(`📊 Parsed ${parsedData.length} rows from CSV`);

    // Convert to employee data format
    const employeeData = parsedData.map(convertToEmployeeData);
    
    // Read the full CSV file from the attached data
    const fullCsvData = `NAMA,As Ochart,Segmentasi,Island,Dept,Job Title,Phone No,Name,Account,Alias,Posisi (HR/GM/VP/BOD/PUB),Title,Department,Gender,Mobile,Office Number,E-mail,Address,Exmail account,Channel,Activation Status,Disabled,WeChat Workplace
Hu Jian,MSI,BOD,Java,BOD,President Director,,呼剑,HuJianeric,Hu Jian,BOD,President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Male,6281315977268,,,,hujianeric@motorsights.net,,Activated,,Not follow
Shen Shumeng (Sarah),MSI,BOD,Java,BOD,Vice President Director,,申舒萌,ShenShuMeng,Shen Shumeng (Sarah),BOD,Vice President Director,剑展MOTORSIGHTSINTERNATIONAL/BOD,Female,6282213195555,,,"Ruko Inkopal Blok A No. 17 & 18, Jl. Boulevard Barat Kelapa Gading Jakarta Utara– Indonesia 14240",shenshumeng@motorsights.net,,Activated,,Not follow
Reny Ayu Chrisyanty,MSI,G4-SFCC,Java,SFCC,Finance Controller Supervisor,081210861552,Reny A_Jkt_MSI-IEC_FinCtrlSpv,renyayu,Reny Ayu Chrisyanty,,Finance Controller Supervisor,剑展MOTORSIGHTSINTERNATIONAL/中台 (MSI)[EN:CO Shared Service (MSI)]/财务[EN:FAT]/财政[EN:Finance],Female,6281210861552,,renyayu30@gmail.com,TAMAN WISMA ASRI JL. NANGKA 3 BLOK E33 NO. 7 RT. 02 RW. 016 KEL. TELUKPUCUNG BEKASI UTARA 17121,renyayu@motorsights.net,,Activated,,Not follow`;

    const fullParsedData = parseCSV(fullCsvData);
    const fullEmployeeData = fullParsedData.map(convertToEmployeeData);

    console.log(`📋 Generated ${fullEmployeeData.length} employee records`);
    
    // Generate seeder content
    const seederContent = generateSeederContent(fullEmployeeData);
    
    // Write seeder file
    const seederPath = path.join(__dirname, '..', 'src', 'repository', 'postgres', 'seeders', '0011_complete_employee_data_seeder.js');
    fs.writeFileSync(seederPath, seederContent);
    
    console.log(`✅ Seeder file created: ${seederPath}`);
    console.log(`📊 Total employees: ${fullEmployeeData.length}`);
    
    return fullEmployeeData;

  } catch (error) {
    console.error('❌ Error generating seeder:', error);
    throw error;
  }
}

function generateSeederContent(employeeData) {
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
        console.log(\`🏝️  Created island: \${cleanIslandName}\`);
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
        console.log(\`👤 Created gender: \${cleanGenderName}\`);
        return genderId;
      }
      
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
        console.log(\`💼 Created title: \${cleanTitleName}\`);
        return titleId;
      }
      
      return title.title_id;
    };

    // Process employee data
    console.log('📊 Processing employee data...');
    
    let processedCount = 0;
    let skippedCount = 0;
    let userCreatedCount = 0;
    const errors = [];

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

// Run the script
if (require.main === module) {
  generateSeederFile();
}

module.exports = {
  generateSeederFile,
  parseCSV,
  convertToEmployeeData
};`;
