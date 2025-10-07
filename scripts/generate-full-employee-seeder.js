const fs = require('fs')
const csv = require('csv-parser')

/**
 * Script to generate full employee seeder from CSV file
 * Usage: node scripts/generate-full-employee-seeder.js <csv-file>
 */

const generateSeeder = async (csvFile) => {
  try {
    console.log(`📄 Reading CSV file: ${csvFile}`)
    
    const employees = []
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFile, { encoding: 'utf8' })
        .pipe(csv())
        .on('data', (data) => {
          // Clean and structure the data
          const employee = {
            name: data.Name || '',
            account: data.Account || '',
            alias: data.Alias || '',
            position: data['Posisi (HR/GM/VP/BOD/PUB)'] || '',
            title: data.Title || '',
            department: data.Department || '',
            gender: data.Gender || '',
            mobile: data.Mobile || '',
            officeNumber: data['Office Number'] || '',
            email: data['E-mail'] || '',
            address: data.Address || '',
            exmailAccount: data['Exmail account'] || '',
            channel: data.Channel || '',
            activationStatus: data['Activation Status'] || '',
            disabled: data.Disabled || '',
            wechatWorkplace: data['WeChat Workplace'] || ''
          }
          
          employees.push(employee)
        })
        .on('end', () => {
          console.log(`✅ Processed ${employees.length} employee records`)
          
          // Generate seeder file content
          const seederContent = generateSeederContent(employees)
          
          // Write seeder file
          const outputFile = 'src/repository/postgres/seeders/0007_full_employees_seeder.js'
          fs.writeFileSync(outputFile, seederContent)
          
          console.log(`✅ Generated seeder file: ${outputFile}`)
          console.log(`📊 Total employees: ${employees.length}`)
          
          resolve({
            totalEmployees: employees.length,
            outputFile
          })
        })
        .on('error', reject)
    })
    
  } catch (error) {
    console.error('❌ Error generating seeder:', error)
    throw error
  }
}

const generateSeederContent = (employees) => {
  const employeeDataStr = JSON.stringify(employees, null, 6)
    .replace(/"/g, "'")
    .replace(/'/g, "'")
  
  return `const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

/**
 * Full Employees and Users Seeder
 * Generated from CSV data - ${employees.length} records
 */
exports.seed = async function(knex) {
  try {
    console.log('🌱 Creating Full Employees and Users seeder...')
    console.log('📊 Processing ${employees.length} employee records...')
    
    // Employee data from CSV
    const employeeData = ${employeeDataStr}

    // Get default role for users
    const defaultRole = await knex('roles')
      .where('role_name', 'Employee')
      .where('is_delete', false)
      .first()

    let roleId = null
    if (!defaultRole) {
      const anyRole = await knex('roles')
        .where('is_delete', false)
        .first()
      
      if (!anyRole) {
        throw new Error('No roles found in database. Please ensure roles table has data.')
      }
      roleId = anyRole.role_id
    } else {
      roleId = defaultRole.role_id
    }

    // Get or create genders
    const genders = ['Male', 'Female', 'Other']
    const genderMap = new Map()
    
    for (const genderName of genders) {
      let gender = await knex('genders')
        .where('gender_name', genderName)
        .where('is_delete', false)
        .first()
      
      if (!gender) {
        const genderId = uuidv4()
        await knex('genders').insert({
          gender_id: genderId,
          gender_name: genderName,
          created_by: null,
          created_at: new Date().toISOString()
        })
        genderMap.set(genderName, genderId)
      } else {
        genderMap.set(genderName, gender.gender_id)
      }
    }

    // Get default company
    const defaultCompany = await knex('companies')
      .where('is_delete', false)
      .first()

    if (!defaultCompany) {
      throw new Error('No companies found. Please ensure companies table has data.')
    }

    // Helper function to get or create department
    const getOrCreateDepartment = async (departmentPath) => {
      if (!departmentPath || !departmentPath.trim()) {
        return null
      }
      
      const departments = departmentPath.split('/').map(d => d.trim()).filter(d => d)
      if (departments.length === 0) return null
      
      const lastLevelDepartment = departments[departments.length - 1]
      
      // Try to find existing department
      let department = await knex('departments')
        .where('department_name', lastLevelDepartment)
        .where('is_delete', false)
        .first()
      
      if (!department) {
        // Try to match with company name
        const matchingCompany = await knex('companies')
          .where('is_delete', false)
          .whereRaw('LOWER(company_name) LIKE ?', [\`%\${lastLevelDepartment.toLowerCase()}%\`])
          .first()
        
        const departmentId = uuidv4()
        await knex('departments').insert({
          department_id: departmentId,
          department_name: lastLevelDepartment,
          company_id: matchingCompany ? matchingCompany.company_id : defaultCompany.company_id,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        return departmentId
      }
      
      return department.department_id
    }

    // Helper function to get or create title
    const getOrCreateTitle = async (titleName, departmentId) => {
      if (!titleName || !titleName.trim() || !departmentId) {
        return null
      }
      
      const cleanTitleName = titleName.trim()
      
      let title = await knex('titles')
        .where('title_name', cleanTitleName)
        .where('department_id', departmentId)
        .where('is_delete', false)
        .first()
      
      if (!title) {
        const titleId = uuidv4()
        await knex('titles').insert({
          title_id: titleId,
          title_name: cleanTitleName,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        return titleId
      }
      
      return title.title_id
    }

    // Process employee data
    console.log('Processing employee data...')
    
    const employeeInserts = []
    const userInserts = []
    let processedCount = 0
    let skippedCount = 0
    
    for (const emp of employeeData) {
      try {
        // Skip if account or channel is empty
        if (!emp.account || !emp.channel) {
          console.log(\`⚠️ Skipping employee: \${emp.name} - missing account or channel\`)
          skippedCount++
          continue
        }
        
        // Check if user already exists
        const existingUser = await knex('users')
          .where('user_name', emp.account)
          .orWhere('user_email', emp.channel)
          .where('is_delete', false)
          .first()
        
        if (existingUser) {
          console.log(\`⚠️ Skipping employee: \${emp.name} - user already exists\`)
          skippedCount++
          continue
        }
        
        // Check if employee already exists
        const existingEmployee = await knex('employees')
          .where('employee_name', emp.alias || emp.name)
          .where('is_delete', false)
          .first()
        
        if (existingEmployee) {
          console.log(\`⚠️ Skipping employee: \${emp.name} - employee already exists\`)
          skippedCount++
          continue
        }
        
        // Get or create department
        const departmentId = await getOrCreateDepartment(emp.department)
        
        // Get or create title
        const titleId = departmentId ? await getOrCreateTitle(emp.title, departmentId) : null
        
        // Get gender ID
        const genderId = emp.gender ? genderMap.get(emp.gender) : null
        
        // Create employee
        const employeeId = uuidv4()
        employeeInserts.push({
          employee_id: employeeId,
          employee_name: emp.alias || emp.name,
          employee_email: emp.email || '',
          employee_mobile: emp.mobile || '',
          employee_office_number: emp.officeNumber || '',
          employee_address: emp.address || '',
          employee_exmail_account: emp.exmailAccount || '',
          employee_channel: emp.channel || '',
          employee_activation_status: emp.activationStatus || '',
          employee_disabled: emp.disabled === 'TRUE' || emp.disabled === '1' || emp.disabled === 'true',
          employee_wechat_workplace: emp.wechatWorkplace || '',
          title_id: titleId,
          gender_id: genderId,
          department_id: departmentId,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        // Create user
        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash('QwerMSI2025!', 5) // Default password
        
        userInserts.push({
          user_id: userId,
          employee_id: employeeId,
          role_id: roleId,
          user_name: emp.account,
          user_email: emp.channel,
          user_password: hashedPassword,
          created_by: null,
          created_at: new Date().toISOString()
        })
        
        processedCount++
        
        if (processedCount % 50 === 0) {
          console.log(\`📊 Processed \${processedCount} employees...\`)
        }
        
      } catch (error) {
        console.error(\`❌ Error processing employee \${emp.name}:\`, error.message)
        skippedCount++
        continue
      }
    }
    
    console.log(\`📊 Processing summary:\`)
    console.log(\`  - Total records: \${employeeData.length}\`)
    console.log(\`  - Processed: \${processedCount}\`)
    console.log(\`  - Skipped: \${skippedCount}\`)
    
    // Insert employees in batches
    if (employeeInserts.length > 0) {
      console.log('💾 Inserting employees...')
      const batchSize = 50
      for (let i = 0; i < employeeInserts.length; i += batchSize) {
        const batch = employeeInserts.slice(i, i + batchSize)
        await knex('employees').insert(batch)
        console.log(\`  - Inserted batch \${Math.floor(i/batchSize) + 1}/\${Math.ceil(employeeInserts.length/batchSize)}\`)
      }
      console.log(\`✅ Inserted \${employeeInserts.length} employees\`)
    }
    
    // Insert users in batches
    if (userInserts.length > 0) {
      console.log('💾 Inserting users...')
      const batchSize = 50
      for (let i = 0; i < userInserts.length; i += batchSize) {
        const batch = userInserts.slice(i, i + batchSize)
        await knex('users').insert(batch)
        console.log(\`  - Inserted batch \${Math.floor(i/batchSize) + 1}/\${Math.ceil(userInserts.length/batchSize)}\`)
      }
      console.log(\`✅ Inserted \${userInserts.length} users\`)
    }
    
    console.log('✅ Full Employees and Users seeder completed successfully!')
    console.log(\`📊 Final summary:\`)
    console.log(\`  - \${employeeInserts.length} Employees created\`)
    console.log(\`  - \${userInserts.length} Users created\`)
    console.log(\`  - \${skippedCount} Records skipped\`)
    console.log(\`  - Default password: QwerMSI2025!\`)

  } catch (error) {
    console.error('❌ Full Employees and Users seeder failed:', error)
    throw error
  }
}`
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.log('Usage: node scripts/generate-full-employee-seeder.js <csv-file>')
    console.log('Example: node scripts/generate-full-employee-seeder.js "data karyawan - Sheet1 (2).csv"')
    process.exit(1)
  }
  
  const csvFile = args[0]
  
  generateSeeder(csvFile)
    .then(result => {
      console.log('✅ Seeder generation completed successfully!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seeder generation failed:', error)
      process.exit(1)
    })
}

module.exports = { generateSeeder }
