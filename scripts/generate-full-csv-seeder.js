const fs = require('fs');
const path = require('path');

/**
 * Script untuk membuat seeder lengkap dari file CSV yang ada
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

function readAndParseCSV() {
  try {
    const csvFilePath = path.join(__dirname, '..', 'data_karyawan_lengkap_advanced.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    
    const lines = csvContent.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    const employeeData = [];

    console.log(`📄 Reading CSV file: ${csvFilePath}`);
    console.log(`📊 Found ${lines.length - 1} data rows`);

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
  } catch (error) {
    console.error('❌ Error reading CSV file:', error);
    throw error;
  }
}

function generateFullSeederContent(employeeData) {
  // Split data into chunks for better memory management
  const chunkSize = 100;
  const chunks = [];
  
  for (let i = 0; i < employeeData.length; i += chunkSize) {
    chunks.push(employeeData.slice(i, i + chunkSize));
  }

  // Generate the seeder content
  let seederContent = `const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Full Employee Data Seeder from Complete CSV
 * Generated from complete CSV data - ${employeeData.length} records
 * 
 * Data dibagi dalam ${chunks.length} chunks untuk optimasi memory
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Starting Full Employee Data Seeder...');
    console.log('📊 Processing ${employeeData.length} employee records from CSV...');
    
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

    // Cache untuk optimasi
    const islandCache = new Map();
    const genderCache = new Map();
    const companyCache = new Map();
    const departmentCache = new Map();
    const titleCache = new Map();

    // Helper functions
    const getOrCreateIsland = async (islandName) => {
      if (!islandName || !islandName.trim()) return null;
      
      const cleanName = islandName.trim();
      if (islandCache.has(cleanName)) return islandCache.get(cleanName);
      
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

    const getOrCreateGender = async (genderName) => {
      if (!genderName || !genderName.trim()) return null;
      
      const cleanName = genderName.trim();
      if (genderCache.has(cleanName)) return genderCache.get(cleanName);
      
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

    const getOrCreateCompany = async (companyName) => {
      if (!companyName || !companyName.trim()) {
        const defaultCompany = await knex('companies').where('is_delete', false).first();
        if (!defaultCompany) throw new Error('No companies found. Please ensure companies table has data.');
        return defaultCompany.company_id;
      }
      
      const cleanName = companyName.trim();
      if (companyCache.has(cleanName)) return companyCache.get(cleanName);
      
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

    const getOrCreateDepartment = async (departmentName, segmentasi, companyId) => {
      if (!departmentName || !departmentName.trim()) return null;
      
      const cleanName = departmentName.trim();
      const cacheKey = \`\${cleanName}|\${companyId}\`;
      if (departmentCache.has(cacheKey)) return departmentCache.get(cacheKey);
      
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

    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) return null;
      
      const cleanName = titleName.trim();
      const cacheKey = \`\${cleanName}|\${departmentId}\`;
      if (titleCache.has(cacheKey)) return titleCache.get(cacheKey);
      
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

    // Process data in chunks
    let totalProcessed = 0;
    let totalSkipped = 0;
    let totalUsers = 0;
    const allErrors = [];
    const processedEmails = new Set();

`;

  // Add data chunks
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    
    seederContent += `
    // Chunk ${chunkIndex + 1}/${chunks.length} - Records ${chunkIndex * chunkSize + 1} to ${Math.min((chunkIndex + 1) * chunkSize, employeeData.length)}
    console.log('📦 Processing chunk ${chunkIndex + 1}/${chunks.length}...');
    const chunk${chunkIndex} = [
`;

    for (let i = 0; i < chunk.length; i++) {
      const emp = chunk[i];
      seederContent += `      {
        nama: '${emp.nama}',
        asOchart: '${emp.asOchart}',
        segmentasi: '${emp.segmentasi}',
        island: '${emp.island}',
        dept: '${emp.dept}',
        jobTitle: '${emp.jobTitle}',
        phoneNo: '${emp.phoneNo}',
        name: '${emp.name}',
        account: '${emp.account}',
        alias: '${emp.alias}',
        posisi: '${emp.posisi}',
        title: '${emp.title}',
        department: '${emp.department}',
        gender: '${emp.gender}',
        mobile: '${emp.mobile}',
        officeNumber: '${emp.officeNumber}',
        email: '${emp.email}',
        address: '${emp.address}',
        exmailAccount: '${emp.exmailAccount}',
        channel: '${emp.channel}',
        activationStatus: '${emp.activationStatus}',
        disabled: '${emp.disabled}',
        wechatWorkplace: '${emp.wechatWorkplace}'
      }`;
      
      if (i < chunk.length - 1) seederContent += ',';
      seederContent += '\n';
    }

    seederContent += `    ];

    // Process chunk ${chunkIndex + 1}
    for (const emp of chunk${chunkIndex}) {
      try {
        if (!emp.nama || emp.nama.trim() === '') {
          totalSkipped++;
          continue;
        }

        const employeeEmail = emp.exmailAccount || emp.email || '';

        if (employeeEmail && processedEmails.has(employeeEmail.toLowerCase())) {
          totalSkipped++;
          continue;
        }

        if (employeeEmail) {
          const existingEmployee = await knex('employees')
            .where('employee_email', employeeEmail)
            .where('is_delete', false)
            .first();

          if (existingEmployee) {
            totalSkipped++;
            continue;
          }
          
          processedEmails.add(employeeEmail.toLowerCase());
        }

        if (emp.exmailAccount && emp.exmailAccount.trim()) {
          const existingUser = await knex('users')
            .where('user_email', emp.exmailAccount)
            .where('is_delete', false)
            .first();

          if (existingUser) {
            totalSkipped++;
            continue;
          }
        }

        const islandId = await getOrCreateIsland(emp.island);
        const genderId = await getOrCreateGender(emp.gender);
        const companyId = await getOrCreateCompany(emp.asOchart);
        const departmentId = await getOrCreateDepartment(emp.dept, emp.segmentasi, companyId);
        const titleId = await getOrCreateTitle(emp.jobTitle || emp.title, departmentId);

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
          
          totalUsers++;
        }

        totalProcessed++;

      } catch (error) {
        console.error(\`❌ Error processing employee \${emp.nama}:\`, error.message);
        allErrors.push({ employee: emp.nama, error: error.message });
        totalSkipped++;
      }
    }

    console.log(\`✅ Chunk ${chunkIndex + 1} completed. Progress: \${totalProcessed}/\${${employeeData.length}}\`);
`;
  }

  seederContent += `
    // Final summary
    console.log('\\n📈 Final Import Summary:');
    console.log(\`✅ Successfully processed: \${totalProcessed} employees\`);
    console.log(\`👥 Users created: \${totalUsers}\`);
    console.log(\`⚠️  Skipped: \${totalSkipped} employees\`);
    
    if (allErrors.length > 0) {
      console.log('\\n❌ Errors encountered:');
      allErrors.slice(0, 10).forEach(err => {
        console.log(\`   - \${err.employee}: \${err.error}\`);
      });
      
      if (allErrors.length > 10) {
        console.log(\`   ... and \${allErrors.length - 10} more errors\`);
      }
    }

    console.log('\\n🎉 Full Employee Data Seeder completed successfully!');

  } catch (error) {
    console.error('❌ Full Employee Seeder failed:', error);
    throw error;
  }
};`;

  return seederContent;
}

function generateFullSeeder() {
  try {
    console.log('🔄 Generating full seeder from CSV...');
    
    const employeeData = readAndParseCSV();
    console.log(`📊 Parsed ${employeeData.length} employee records`);
    
    const seederContent = generateFullSeederContent(employeeData);
    
    const seederPath = path.join(__dirname, '..', 'src', 'repository', 'postgres', 'seeders', '0015_full_employee_data_from_csv.js');
    fs.writeFileSync(seederPath, seederContent);
    
    console.log(`✅ Full Employee Seeder created: ${seederPath}`);
    console.log(`📊 Total employees: ${employeeData.length}`);
    
    return employeeData;

  } catch (error) {
    console.error('❌ Error generating full seeder:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateFullSeeder();
}

module.exports = { generateFullSeeder };
