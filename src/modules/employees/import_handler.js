const fs = require('fs')
const csv = require('csv-parser')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const { pgCore } = require('../../config/database')

/**
 * Parse CSV file with proper encoding handling
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    
    console.log(`Starting to parse CSV file: ${filePath}`)
    
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv({
        skipEmptyLines: true,
        skipLinesWithError: true,
        mapHeaders: ({ header }) => header.trim() // Remove any whitespace from headers
      }))
      .on('data', (data) => {
        // Clean and validate each row
        const cleanData = {}
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null) {
            cleanData[key] = String(value).trim()
          } else {
            cleanData[key] = ''
          }
        }
        results.push(cleanData)
      })
      .on('end', () => {
        console.log(`CSV parsing completed. Found ${results.length} rows`)
        resolve(results)
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error)
        reject(error)
      })
  })
}

/**
 * Validate CSV structure for employee import
 */
const validateCSVStructure = (csvData) => {
  const requiredColumns = [
    'Name', 'Account', 'Alias', 'Posisi (HR/GM/VP/BOD/PUB)', 
    'Title', 'Department', 'Gender', 'Mobile', 'Office Number', 
    'E-mail', 'Address', 'Exmail account', 'Channel', 
    'Activation Status', 'Disabled', 'WeChat Workplace'
  ]
  
  console.log('Validating CSV structure...')
  
  if (!csvData || csvData.length === 0) {
    console.log('CSV validation failed: empty file')
    return {
      isValid: false,
      errors: ['CSV file is empty']
    }
  }
  
  // Check if first row exists and has data
  if (!csvData[0] || typeof csvData[0] !== 'object') {
    console.log('CSV validation failed: no valid data rows')
    return {
      isValid: false,
      errors: ['CSV file has invalid structure - no valid data rows found']
    }
  }
  
  const csvColumns = Object.keys(csvData[0])
  console.log('CSV columns found:', csvColumns)
  
  if (!csvColumns || csvColumns.length === 0) {
    console.log('CSV validation failed: no column headers')
    return {
      isValid: false,
      errors: ['CSV file has no column headers']
    }
  }
  
  // Check for required columns (more flexible matching)
  const missingColumns = []
  const foundColumns = []
  
  for (const requiredCol of requiredColumns) {
    const found = csvColumns.find(col => 
      col.toLowerCase().includes(requiredCol.toLowerCase()) ||
      requiredCol.toLowerCase().includes(col.toLowerCase())
    )
    
    if (!found) {
      missingColumns.push(requiredCol)
    } else {
      foundColumns.push(found)
    }
  }
  
  console.log('Found columns:', foundColumns)
  console.log('Missing columns:', missingColumns)
  
  // Allow some flexibility - only require essential columns
  const essentialColumns = ['Name', 'Account', 'Gender']
  const missingEssential = missingColumns.filter(col => 
    essentialColumns.some(essential => 
      col.toLowerCase().includes(essential.toLowerCase())
    )
  )
  
  if (missingEssential.length > 0) {
    console.log('CSV validation failed: missing essential columns')
    return {
      isValid: false,
      errors: [`Missing essential columns: ${missingEssential.join(', ')}`]
    }
  }
  
  console.log('CSV validation passed')
  return { isValid: true, errors: [], foundColumns }
}

/**
 * Get or create gender
 */
const getOrCreateGender = async (genderName, createdBy) => {
  if (!genderName || !genderName.trim()) {
    return null
  }
  
  const cleanGenderName = genderName.trim()
  
  // Check if gender exists
  const existingGender = await pgCore('genders')
    .where('gender_name', cleanGenderName)
    .where('is_delete', false)
    .first()
  
  if (existingGender) {
    return existingGender.gender_id
  }
  
  // Create new gender
  const genderId = uuidv4()
  await pgCore('genders').insert({
    gender_id: genderId,
    gender_name: cleanGenderName,
    created_by: createdBy,
    created_at: new Date().toISOString()
  })
  
  return genderId
}

/**
 * Get or create title
 */
const getOrCreateTitle = async (titleName, departmentId, createdBy) => {
  if (!titleName || !titleName.trim()) {
    return null
  }
  
  const cleanTitleName = titleName.trim()
  
  // Check if title exists in the department
  const existingTitle = await pgCore('titles')
    .where('title_name', cleanTitleName)
    .where('department_id', departmentId)
    .where('is_delete', false)
    .first()
  
  if (existingTitle) {
    return existingTitle.title_id
  }
  
  // Create new title
  const titleId = uuidv4()
  await pgCore('titles').insert({
    title_id: titleId,
    title_name: cleanTitleName,
    department_id: departmentId,
    created_by: createdBy,
    created_at: new Date().toISOString()
  })
  
  return titleId
}

/**
 * Parse department hierarchy and get department ID
 */
const parseDepartmentAndGetId = async (departmentPath, createdBy) => {
  if (!departmentPath || !departmentPath.trim()) {
    return null
  }
  
  const departments = departmentPath.split('/').map(d => d.trim()).filter(d => d)
  
  if (departments.length === 0) {
    return null
  }
  
  // Get the last level department
  const lastLevelDepartment = departments[departments.length - 1]
  
  // Find company that matches with department name
  const matchingCompany = await pgCore('companies')
    .where('is_delete', false)
    .whereRaw('LOWER(company_name) LIKE ?', [`%${lastLevelDepartment.toLowerCase()}%`])
    .first()
  
  if (!matchingCompany) {
    // If no matching company, try to find existing department
    const existingDepartment = await pgCore('departments')
      .where('department_name', lastLevelDepartment)
      .where('is_delete', false)
      .first()
    
    if (existingDepartment) {
      return existingDepartment.department_id
    }
    
    // Create department without company association
    const departmentId = uuidv4()
    await pgCore('departments').insert({
      department_id: departmentId,
      department_name: lastLevelDepartment,
      company_id: null, // Will need to be updated manually
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return departmentId
  }
  
  // Check if department exists in the company
  const existingDepartment = await pgCore('departments')
    .where('department_name', lastLevelDepartment)
    .where('company_id', matchingCompany.company_id)
    .where('is_delete', false)
    .first()
  
  if (existingDepartment) {
    return existingDepartment.department_id
  }
  
  // Create new department
  const departmentId = uuidv4()
  await pgCore('departments').insert({
    department_id: departmentId,
    department_name: lastLevelDepartment,
    company_id: matchingCompany.company_id,
    created_by: createdBy,
    created_at: new Date().toISOString()
  })
  
  return departmentId
}

/**
 * Check if user already exists
 */
const checkUserExists = async (username, email) => {
  const existingUser = await pgCore('users')
    .where(function() {
      this.where('user_name', username)
        .orWhere('user_email', email)
    })
    .where('is_delete', false)
    .first()
  
  return existingUser
}

/**
 * Check if employee already exists
 */
const checkEmployeeExists = async (employeeName, employeeEmail) => {
  const existingEmployee = await pgCore('employees')
    .where(function() {
      this.where('employee_name', employeeName)
        .orWhere('employee_email', employeeEmail)
    })
    .where('is_delete', false)
    .first()
  
  return existingEmployee
}

/**
 * Batch process employees for better performance
 */
const processBatch = async (batch, defaultRoleId, createdBy, existingUsers, existingEmployees, gendersCache, departmentsCache, titlesCache) => {
  const results = []
  const employeesToInsert = []
  const usersToInsert = []
  const gendersToInsert = []
  const departmentsToInsert = []
  const titlesToInsert = []
  
  for (const row of batch) {
    try {
      const {
        Name: name,
        Account: account,
        Alias: alias,
        'Posisi (HR/GM/VP/BOD/PUB)': position,
        Title: title,
        Department: department,
        Gender: gender,
        Mobile: mobile,
        'Office Number': officeNumber,
        'E-mail': email,
        Address: address,
        'Exmail account': exmailAccount,
        Channel: channel,
        'Activation Status': activationStatus,
        Disabled: disabled,
        'WeChat Workplace': wechatWorkplace
      } = row
      
      // Skip empty rows
      if (!name && !account && !alias) {
        console.log(`Skipping empty row: ${JSON.stringify(row)}`)
        continue
      }
      
      // Clean and validate data
      const cleanName = name ? String(name).trim() : ''
      const cleanAccount = account ? String(account).trim() : ''
      const cleanAlias = alias ? String(alias).trim() : ''
      const cleanEmail = email ? String(email).trim() : ''
      const cleanChannel = channel ? String(channel).trim() : ''
      const cleanDepartment = department ? String(department).trim() : ''
      const cleanGender = gender ? String(gender).trim() : ''
      
      console.log(`Processing employee: ${cleanName || cleanAlias} (${cleanAccount})`)
      
      // Check if user already exists
      const userKey = `${cleanAccount}_${cleanChannel}`
      if (existingUsers.has(userKey)) {
        results.push({
          status: 'skipped',
          data: { name: cleanName, account: cleanAccount, email: cleanChannel },
          message: 'User already exists'
        })
        continue
      }
      
      // Check if employee already exists
      const employeeKey = `${cleanAlias}_${cleanEmail}`
      if (existingEmployees.has(employeeKey)) {
        results.push({
          status: 'skipped',
          data: { name: cleanAlias, email: cleanEmail },
          message: 'Employee already exists'
        })
        continue
      }
      
      // Process gender
      let genderId = null
      if (cleanGender) {
        const cleanGenderName = cleanGender
        if (gendersCache.has(cleanGenderName)) {
          genderId = gendersCache.get(cleanGenderName)
        } else {
          // Will be handled in bulk insert
          genderId = uuidv4()
          gendersToInsert.push({
            gender_id: genderId,
            gender_name: cleanGenderName,
            created_by: createdBy,
            created_at: new Date().toISOString()
          })
          gendersCache.set(cleanGenderName, genderId)
        }
      }
      
      // Process department
      let departmentId = null
      if (cleanDepartment) {
        const departments = cleanDepartment.split('/').map(d => d.trim()).filter(d => d)
        const lastLevelDepartment = departments[departments.length - 1]
        
        if (departmentsCache.has(lastLevelDepartment)) {
          departmentId = departmentsCache.get(lastLevelDepartment)
        } else {
          // Will be handled in bulk insert
          departmentId = uuidv4()
          departmentsToInsert.push({
            department_id: departmentId,
            department_name: lastLevelDepartment,
            company_id: null, // Will need to be updated manually
            created_by: createdBy,
            created_at: new Date().toISOString()
          })
          departmentsCache.set(lastLevelDepartment, departmentId)
        }
      }
      
      // Process title
      let titleId = null
      if (title && title.trim() && departmentId) {
        const cleanTitleName = title.trim()
        const titleKey = `${cleanTitleName}_${departmentId}`
        
        if (titlesCache.has(titleKey)) {
          titleId = titlesCache.get(titleKey)
        } else {
          // Will be handled in bulk insert
          titleId = uuidv4()
          titlesToInsert.push({
            title_id: titleId,
            title_name: cleanTitleName,
            department_id: departmentId,
            created_by: createdBy,
            created_at: new Date().toISOString()
          })
          titlesCache.set(titleKey, titleId)
        }
      }
      
      // Prepare employee data
      const employeeId = uuidv4()
      employeesToInsert.push({
        employee_id: employeeId,
        employee_name: cleanAlias || cleanName,
        employee_email: cleanEmail,
        employee_mobile: mobile ? String(mobile).trim() : '',
        employee_office_number: officeNumber ? String(officeNumber).trim() : '',
        employee_address: address ? String(address).trim() : '',
        employee_exmail_account: exmailAccount ? String(exmailAccount).trim() : '',
        employee_channel: cleanChannel,
        employee_activation_status: activationStatus ? String(activationStatus).trim() : '',
        employee_disabled: disabled === 'TRUE' || disabled === '1' || disabled === 'true',
        employee_wechat_workplace: wechatWorkplace ? String(wechatWorkplace).trim() : '',
        title_id: titleId,
        gender_id: genderId,
        department_id: departmentId,
        created_by: createdBy,
        created_at: new Date().toISOString()
      })
      
      // Prepare user data
      const userId = uuidv4()
      const hashedPassword = await bcrypt.hash('QwerMSI2025!', 5) // Reduced salt rounds for faster processing
      
      usersToInsert.push({
        user_id: userId,
        employee_id: employeeId,
        role_id: defaultRoleId,
        user_name: cleanAccount,
        user_email: cleanChannel,
        user_password: hashedPassword,
        created_by: createdBy,
        created_at: new Date().toISOString()
      })
      
      results.push({
        status: 'created',
        data: {
          employee_id: employeeId,
          user_id: userId,
          name: cleanAlias || cleanName,
          account: cleanAccount,
          email: cleanChannel
        },
        message: 'Employee and user created successfully'
      })
      
    } catch (error) {
      results.push({
        status: 'error',
        data: { name: row.Name, account: row.Account },
        message: error.message
      })
    }
  }
  
  // Bulk insert all data
  try {
    if (gendersToInsert.length > 0) {
      await pgCore('genders').insert(gendersToInsert).onConflict('gender_name').ignore()
    }
    
    if (departmentsToInsert.length > 0) {
      await pgCore('departments').insert(departmentsToInsert)
    }
    
    if (titlesToInsert.length > 0) {
      await pgCore('titles').insert(titlesToInsert).onConflict(['title_name', 'department_id']).ignore()
    }
    
    if (employeesToInsert.length > 0) {
      await pgCore('employees').insert(employeesToInsert)
    }
    
    if (usersToInsert.length > 0) {
      await pgCore('users').insert(usersToInsert)
    }
  } catch (error) {
    console.error('Batch insert error:', error)
    // Mark all as errors if batch insert fails
    results.forEach(result => {
      if (result.status === 'created') {
        result.status = 'error'
        result.message = 'Batch insert failed: ' + error.message
      }
    })
  }
  
  return results
}

/**
 * Import employees from CSV data with batch processing
 */
const importEmployees = async (csvData, createdBy) => {
  try {
    const results = []
    
    // Get default role ID with error handling
    console.log('Getting default role ID...')
    const defaultRoleId = await getDefaultRoleId()
    
    if (!defaultRoleId) {
      throw new Error('No valid role found for employee import')
    }
    
    console.log('Pre-loading existing data...')
    
    // Pre-load existing data to avoid duplicate queries
    const existingUsers = await pgCore('users')
      .where('is_delete', false)
      .select('user_name', 'user_email')
    
    const existingEmployees = await pgCore('employees')
      .where('is_delete', false)
      .select('employee_name', 'employee_email')
    
    const existingGenders = await pgCore('genders')
      .where('is_delete', false)
      .select('gender_id', 'gender_name')
  
  // Create lookup maps
  const usersMap = new Map()
  const employeesMap = new Map()
  const gendersMap = new Map()
  
  existingUsers.forEach(user => {
    usersMap.set(`${user.user_name}_${user.user_email}`, user)
  })
  
  existingEmployees.forEach(employee => {
    employeesMap.set(`${employee.employee_name}_${employee.employee_email}`, employee)
  })
  
  existingGenders.forEach(gender => {
    gendersMap.set(gender.gender_name, gender.gender_id)
  })
  
  // Process in batches of 50 to avoid memory issues
  const batchSize = 50
  const totalBatches = Math.ceil(csvData.length / batchSize)
  
  console.log(`Processing ${csvData.length} records in ${totalBatches} batches of ${batchSize}`)
  
  for (let i = 0; i < csvData.length; i += batchSize) {
    const batch = csvData.slice(i, i + batchSize)
    const batchNumber = Math.floor(i / batchSize) + 1
    
    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)`)
    
    try {
      const batchResults = await processBatch(
        batch, 
        defaultRoleId, 
        createdBy, 
        usersMap, 
        employeesMap, 
        gendersMap,
        new Map(), // departmentsCache
        new Map()  // titlesCache
      )
      
      results.push(...batchResults)
      
      // Add small delay between batches to prevent overwhelming the database
      if (i + batchSize < csvData.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
    } catch (error) {
      console.error(`Batch ${batchNumber} failed:`, error)
      
      // Mark all records in this batch as errors
      batch.forEach(row => {
        results.push({
          status: 'error',
          data: { name: row.Name, account: row.Account },
          message: `Batch ${batchNumber} failed: ${error.message}`
        })
      })
    }
  }
  
  return results
  
  } catch (error) {
    console.error('Import employees error:', error)
    throw new Error(`Failed to import employees: ${error.message}`)
  }
}

/**
 * Get default role ID (assuming there's a default role for employees)
 */
const getDefaultRoleId = async () => {
  try {
    const defaultRole = await pgCore('roles')
      .where('role_name', 'Employee')
      .where('is_delete', false)
      .first()
    
    if (defaultRole) {
      return defaultRole.role_id
    }
    
    // If no Employee role, get any role (fallback)
    const anyRole = await pgCore('roles')
      .where('is_delete', false)
      .first()
    
    if (anyRole) {
      return anyRole.role_id
    }
    
    console.warn('No roles found in database. Employee import will fail without a valid role.')
    throw new Error('No valid roles found in database. Please ensure roles table has data.')
    
  } catch (error) {
    console.error('Error getting default role ID:', error)
    throw new Error(`Failed to get default role: ${error.message}`)
  }
}

/**
 * Error response helper
 */
const errorResponse = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    details
  })
}

/**
 * Success response helper
 */
const successResponse = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data
  })
}

/**
 * Main import function for employees with timeout handling
 */
const importEmployeeData = async (req, res) => {
  let timeoutId = null
  
  try {
    if (!req.file) {
      return errorResponse(res, 'No CSV file uploaded', 400)
    }
    
    const filePath = req.file.path
    
    // Set timeout for the entire operation (5 minutes)
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Import operation timed out after 5 minutes'))
      }, 5 * 60 * 1000) // 5 minutes
    })
    
    // Parse CSV
    console.log('Starting CSV parsing...')
    console.log('File path:', filePath)
    console.log('File exists:', fs.existsSync(filePath))
    console.log('File size:', fs.statSync(filePath).size, 'bytes')
    
    const csvData = await Promise.race([
      parseCSV(filePath),
      timeoutPromise
    ])
    
    console.log(`CSV parsed successfully. Found ${csvData.length} records`)
    
    // Validate CSV structure
    const structureValidation = validateCSVStructure(csvData)
    if (!structureValidation.isValid) {
      // Clean up uploaded file
      fs.unlinkSync(filePath)
      return errorResponse(res, 'Invalid CSV structure', 400, structureValidation.errors)
    }
    
    const createdBy = req.user?.user_id
    
    // Check if file is too large (more than 1000 records)
    if (csvData.length > 1000) {
      // Clean up uploaded file
      fs.unlinkSync(filePath)
      return errorResponse(res, 'File too large. Maximum 1000 records allowed per import.', 400)
    }
    
    console.log('Starting employee import process...')
    
    // Import employees with timeout
    const importResults = await Promise.race([
      importEmployees(csvData, createdBy),
      timeoutPromise
    ])
    
    // Clear timeout since operation completed
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath)
    
    const summary = {
      total: importResults.length,
      created: importResults.filter(r => r.status === 'created').length,
      skipped: importResults.filter(r => r.status === 'skipped').length,
      errors: importResults.filter(r => r.status === 'error').length
    }
    
    console.log('Import completed:', summary)
    
    return successResponse(res, 'Employee import completed successfully', {
      summary,
      results: importResults.slice(0, 100) // Limit results to first 100 for response size
    })
    
  } catch (error) {
    console.error('Import employee error:', error)
    
    // Clear timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    // Handle timeout error specifically
    if (error.message.includes('timed out')) {
      return errorResponse(res, 'Import operation timed out. Please try with a smaller file or contact administrator.', 408)
    }
    
    return errorResponse(res, 'Failed to import employee data: ' + error.message, 500)
  }
}

/**
 * Get employee import template
 */
const getEmployeeImportTemplate = async (req, res) => {
  try {
    const templateData = [
      {
        'Name': 'John Doe',
        'Account': 'johndoe',
        'Alias': 'John D',
        'Posisi (HR/GM/VP/BOD/PUB)': 'HR',
        'Title': 'HR Manager',
        'Department': 'Human Resources/HR Department',
        'Gender': 'Male',
        'Mobile': '081234567890',
        'Office Number': '021-12345678',
        'E-mail': 'john.doe@company.com',
        'Address': 'Jakarta, Indonesia',
        'Exmail account': 'john.doe@exmail.company.com',
        'Channel': 'john.doe@company.com',
        'Activation Status': 'Active',
        'Disabled': 'FALSE',
        'WeChat Workplace': 'johndoe_wechat'
      }
    ]
    
    const csvHeader = Object.keys(templateData[0]).join(',')
    const csvRow = Object.values(templateData[0]).join(',')
    const csvContent = csvHeader + '\n' + csvRow
    
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="employee_import_template.csv"')
    
    return res.status(200).send(csvContent)
    
  } catch (error) {
    console.error('Get employee template error:', error)
    return errorResponse(res, 'Failed to get employee import template', 500)
  }
}

module.exports = {
  importEmployeeData,
  getEmployeeImportTemplate
}
