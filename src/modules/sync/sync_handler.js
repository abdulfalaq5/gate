const fs = require('fs')
const csv = require('csv-parser')
const { v4: uuidv4 } = require('uuid')
const { pgCore } = require('../../config/database')
const { successResponse, errorResponse } = require('../../utils/response')

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
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (data) => {
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
 * Validate CSV structure for sync data
 */
const validateCSVStructure = (csvData) => {
  const requiredColumns = [
    'Company Name',
    'Department Name',
    'Department Segmentasi',
    'Title Name',
    'Island Name',
    'Employee Name',
    'Employee Email',
    'Employee Phone',
    'Employee Office Number',
    'Employee Address',
    'Employee Exmail Account',
    'Employee Channel',
    'Employee Activation Status',
    'Employee Disabled',
    'Employee WeChat Workplace'
  ]
  
  if (!csvData || csvData.length === 0) {
    return {
      isValid: false,
      errors: ['CSV file is empty']
    }
  }
  
  const csvColumns = Object.keys(csvData[0])
  
  if (!csvColumns || csvColumns.length === 0) {
    return {
      isValid: false,
      errors: ['CSV file has no column headers']
    }
  }
  
  // Check for required columns (flexible matching)
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
  
  // Essential columns for sync
  const essentialColumns = ['Company Name', 'Department Name', 'Title Name', 'Employee Name', 'Employee Email']
  const missingEssential = missingColumns.filter(col => 
    essentialColumns.some(essential => 
      col.toLowerCase().includes(essential.toLowerCase())
    )
  )
  
  if (missingEssential.length > 0) {
    return {
      isValid: false,
      errors: [`Missing essential columns: ${missingEssential.join(', ')}`]
    }
  }
  
  return { isValid: true, errors: [], foundColumns }
}

/**
 * Sync Company - Upsert based on company_name
 */
const syncCompany = async (companyName, companyData, createdBy) => {
  if (!companyName || !companyName.trim()) {
    return null
  }
  
  const cleanName = companyName.trim()
  
  // Check if company exists
  const existingCompany = await pgCore('companies')
    .where('company_name', cleanName)
    .where('is_delete', false)
    .first()
  
  if (existingCompany) {
    // Update existing company
    const updateData = {
      company_address: companyData.company_address || existingCompany.company_address,
      company_email: companyData.company_email || existingCompany.company_email,
      updated_by: createdBy,
      updated_at: new Date().toISOString()
    }
    
    await pgCore('companies')
      .where('company_id', existingCompany.company_id)
      .update(updateData)
    
    return {
      company_id: existingCompany.company_id,
      status: 'updated',
      company_name: cleanName
    }
  } else {
    // Create new company
    const companyId = uuidv4()
    await pgCore('companies').insert({
      company_id: companyId,
      company_name: cleanName,
      company_address: companyData.company_address || null,
      company_email: companyData.company_email || null,
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return {
      company_id: companyId,
      status: 'created',
      company_name: cleanName
    }
  }
}

/**
 * Sync Island - Upsert based on island_name (unique)
 */
const syncIsland = async (islandName, createdBy) => {
  if (!islandName || !islandName.trim()) {
    return null
  }
  
  const cleanName = islandName.trim()
  
  // Check if island exists
  const existingIsland = await pgCore('islands')
    .where('island_name', cleanName)
    .where('is_delete', false)
    .first()
  
  if (existingIsland) {
    return {
      island_id: existingIsland.island_id,
      status: 'existing',
      island_name: cleanName
    }
  } else {
    // Create new island
    const islandId = uuidv4()
    await pgCore('islands').insert({
      island_id: islandId,
      island_name: cleanName,
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return {
      island_id: islandId,
      status: 'created',
      island_name: cleanName
    }
  }
}

/**
 * Sync Department - Upsert based on department_name + company_id
 */
const syncDepartment = async (departmentName, companyId, segmentasi, createdBy) => {
  if (!departmentName || !departmentName.trim() || !companyId) {
    return null
  }
  
  const cleanName = departmentName.trim()
  
  // Check if department exists
  const existingDepartment = await pgCore('departments')
    .where('department_name', cleanName)
    .where('company_id', companyId)
    .where('is_delete', false)
    .first()
  
  if (existingDepartment) {
    // Update existing department
    const updateData = {
      department_segmentasi: segmentasi || existingDepartment.department_segmentasi,
      updated_by: createdBy,
      updated_at: new Date().toISOString()
    }
    
    await pgCore('departments')
      .where('department_id', existingDepartment.department_id)
      .update(updateData)
    
    return {
      department_id: existingDepartment.department_id,
      status: 'updated',
      department_name: cleanName
    }
  } else {
    // Create new department
    const departmentId = uuidv4()
    await pgCore('departments').insert({
      department_id: departmentId,
      department_name: cleanName,
      company_id: companyId,
      department_segmentasi: segmentasi || null,
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return {
      department_id: departmentId,
      status: 'created',
      department_name: cleanName
    }
  }
}

/**
 * Sync Title - Upsert based on title_name + department_id
 */
const syncTitle = async (titleName, departmentId, createdBy) => {
  if (!titleName || !titleName.trim() || !departmentId) {
    return null
  }
  
  const cleanName = titleName.trim()
  
  // Check if title exists
  const existingTitle = await pgCore('titles')
    .where('title_name', cleanName)
    .where('department_id', departmentId)
    .where('is_delete', false)
    .first()
  
  if (existingTitle) {
    return {
      title_id: existingTitle.title_id,
      status: 'existing',
      title_name: cleanName
    }
  } else {
    // Create new title
    const titleId = uuidv4()
    await pgCore('titles').insert({
      title_id: titleId,
      title_name: cleanName,
      department_id: departmentId,
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return {
      title_id: titleId,
      status: 'created',
      title_name: cleanName
    }
  }
}

/**
 * Sync Employee - Upsert based on employee_email
 */
const syncEmployee = async (employeeData, titleId, departmentId, islandId, createdBy) => {
  if (!employeeData.employee_email || !employeeData.employee_email.trim()) {
    return null
  }
  
  const cleanEmail = employeeData.employee_email.trim()
  
  // Check if employee exists
  const existingEmployee = await pgCore('employees')
    .where('employee_email', cleanEmail)
    .where('is_delete', false)
    .first()
  
  const employeePayload = {
    employee_name: employeeData.employee_name || '',
    employee_email: cleanEmail,
    employee_phone: employeeData.employee_phone || null,
    employee_office_number: employeeData.employee_office_number || null,
    employee_address: employeeData.employee_address || null,
    employee_exmail_account: employeeData.employee_exmail_account || cleanEmail,
    employee_channel: employeeData.employee_channel || cleanEmail,
    employee_activation_status: employeeData.employee_activation_status || null,
    employee_disabled: employeeData.employee_disabled === 'TRUE' || employeeData.employee_disabled === '1' || employeeData.employee_disabled === 'true' || false,
    employee_wechat_workplace: employeeData.employee_wechat_workplace || null,
    title_id: titleId,
    department_id: departmentId,
    island_id: islandId
  }
  
  if (existingEmployee) {
    // Update existing employee
    await pgCore('employees')
      .where('employee_id', existingEmployee.employee_id)
      .update({
        ...employeePayload,
        updated_by: createdBy,
        updated_at: new Date().toISOString()
      })
    
    return {
      employee_id: existingEmployee.employee_id,
      status: 'updated',
      employee_name: employeePayload.employee_name,
      employee_email: cleanEmail
    }
  } else {
    // Create new employee
    const employeeId = uuidv4()
    await pgCore('employees').insert({
      employee_id: employeeId,
      ...employeePayload,
      created_by: createdBy,
      created_at: new Date().toISOString()
    })
    
    return {
      employee_id: employeeId,
      status: 'created',
      employee_name: employeePayload.employee_name,
      employee_email: cleanEmail
    }
  }
}

/**
 * Main sync function - Process CSV data and sync all entities
 */
const syncData = async (csvData, createdBy) => {
  const results = {
    companies: { created: 0, updated: 0, errors: 0 },
    islands: { created: 0, existing: 0, errors: 0 },
    departments: { created: 0, updated: 0, errors: 0 },
    titles: { created: 0, existing: 0, errors: 0 },
    employees: { created: 0, updated: 0, errors: 0 }
  }
  
  const errors = []
  
  // Cache untuk menghindari query berulang
  const companyCache = new Map()
  const islandCache = new Map()
  const departmentCache = new Map()
  const titleCache = new Map()
  
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i]
    
    try {
      // Extract data from CSV row
      const companyName = row['Company Name'] || row['company_name'] || row['Company'] || ''
      const departmentName = row['Department Name'] || row['department_name'] || row['Department'] || row['Dept'] || ''
      const departmentSegmentasi = row['Department Segmentasi'] || row['department_segmentasi'] || row['Segmentasi'] || ''
      const titleName = row['Title Name'] || row['title_name'] || row['Title'] || row['Job Title'] || ''
      const islandName = row['Island Name'] || row['island_name'] || row['Island'] || ''
      
      // Sync Company
      let companyId = null
      if (companyName) {
        const companyKey = companyName.trim().toLowerCase()
        if (companyCache.has(companyKey)) {
          companyId = companyCache.get(companyKey)
        } else {
          const companyResult = await syncCompany(companyName, {
            company_address: row['Company Address'] || row['company_address'] || null,
            company_email: row['Company Email'] || row['company_email'] || null
          }, createdBy)
          
          if (companyResult) {
            companyId = companyResult.company_id
            companyCache.set(companyKey, companyId)
            
            if (companyResult.status === 'created') {
              results.companies.created++
            } else if (companyResult.status === 'updated') {
              results.companies.updated++
            }
          }
        }
      }
      
      // Sync Island
      let islandId = null
      if (islandName) {
        const islandKey = islandName.trim().toLowerCase()
        if (islandCache.has(islandKey)) {
          islandId = islandCache.get(islandKey)
        } else {
          const islandResult = await syncIsland(islandName, createdBy)
          
          if (islandResult) {
            islandId = islandResult.island_id
            islandCache.set(islandKey, islandId)
            
            if (islandResult.status === 'created') {
              results.islands.created++
            } else if (islandResult.status === 'existing') {
              results.islands.existing++
            }
          }
        }
      }
      
      // Sync Department (requires company)
      let departmentId = null
      if (departmentName && companyId) {
        const departmentKey = `${departmentName.trim().toLowerCase()}_${companyId}`
        if (departmentCache.has(departmentKey)) {
          departmentId = departmentCache.get(departmentKey)
        } else {
          const departmentResult = await syncDepartment(departmentName, companyId, departmentSegmentasi, createdBy)
          
          if (departmentResult) {
            departmentId = departmentResult.department_id
            departmentCache.set(departmentKey, departmentId)
            
            if (departmentResult.status === 'created') {
              results.departments.created++
            } else if (departmentResult.status === 'updated') {
              results.departments.updated++
            }
          }
        }
      }
      
      // Sync Title (requires department)
      let titleId = null
      if (titleName && departmentId) {
        const titleKey = `${titleName.trim().toLowerCase()}_${departmentId}`
        if (titleCache.has(titleKey)) {
          titleId = titleCache.get(titleKey)
        } else {
          const titleResult = await syncTitle(titleName, departmentId, createdBy)
          
          if (titleResult) {
            titleId = titleResult.title_id
            titleCache.set(titleKey, titleId)
            
            if (titleResult.status === 'created') {
              results.titles.created++
            } else if (titleResult.status === 'existing') {
              results.titles.existing++
            }
          }
        }
      }
      
      // Sync Employee (requires title)
      if (row['Employee Email'] || row['employee_email'] || row['E-mail']) {
        const employeeEmail = row['Employee Email'] || row['employee_email'] || row['E-mail']
        const employeeData = {
          employee_name: row['Employee Name'] || row['employee_name'] || row['Name'] || row['Alias'] || '',
          employee_email: employeeEmail,
          employee_phone: row['Employee Phone'] || row['employee_phone'] || row['Phone No'] || row['Mobile'] || null,
          employee_office_number: row['Employee Office Number'] || row['employee_office_number'] || row['Office Number'] || null,
          employee_address: row['Employee Address'] || row['employee_address'] || row['Address'] || null,
          employee_exmail_account: row['Employee Exmail Account'] || row['employee_exmail_account'] || row['Exmail account'] || employeeEmail,
          employee_channel: row['Employee Channel'] || row['employee_channel'] || row['Channel'] || employeeEmail,
          employee_activation_status: row['Employee Activation Status'] || row['employee_activation_status'] || row['Activation Status'] || null,
          employee_disabled: row['Employee Disabled'] || row['employee_disabled'] || row['Disabled'] || 'FALSE',
          employee_wechat_workplace: row['Employee WeChat Workplace'] || row['employee_wechat_workplace'] || row['WeChat Workplace'] || null
        }
        
        if (titleId) {
          const employeeResult = await syncEmployee(employeeData, titleId, departmentId, islandId, createdBy)
          
          if (employeeResult) {
            if (employeeResult.status === 'created') {
              results.employees.created++
            } else if (employeeResult.status === 'updated') {
              results.employees.updated++
            }
          }
        } else {
          errors.push({
            row: i + 1,
            error: 'Cannot sync employee: Title is required but not found'
          })
          results.employees.errors++
        }
      }
      
    } catch (error) {
      console.error(`Error processing row ${i + 1}:`, error)
      errors.push({
        row: i + 1,
        error: error.message
      })
    }
  }
  
  return {
    results,
    errors: errors.slice(0, 100) // Limit errors to first 100
  }
}

/**
 * Main sync handler function
 */
const syncDataHandler = async (req, res) => {
  let timeoutId = null
  
  try {
    if (!req.file) {
      return errorResponse(res, 'No CSV file uploaded', 400)
    }
    
    const filePath = req.file.path
    
    // Set timeout for the entire operation (10 minutes)
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Sync operation timed out after 10 minutes'))
      }, 10 * 60 * 1000)
    })
    
    // Parse CSV
    console.log('Starting CSV parsing for sync...')
    const csvData = await Promise.race([
      parseCSV(filePath),
      timeoutPromise
    ])
    
    console.log(`CSV parsed successfully. Found ${csvData.length} records`)
    
    // Validate CSV structure
    const structureValidation = validateCSVStructure(csvData)
    if (!structureValidation.isValid) {
      fs.unlinkSync(filePath)
      return errorResponse(res, 'Invalid CSV structure', 400, structureValidation.errors)
    }
    
    const createdBy = req.user?.user_id
    
    console.log('Starting sync process...')
    
    // Sync data with timeout
    const syncResults = await Promise.race([
      syncData(csvData, createdBy),
      timeoutPromise
    ])
    
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath)
    
    const summary = {
      total_rows: csvData.length,
      companies: {
        total: syncResults.results.companies.created + syncResults.results.companies.updated,
        created: syncResults.results.companies.created,
        updated: syncResults.results.companies.updated,
        errors: syncResults.results.companies.errors
      },
      islands: {
        total: syncResults.results.islands.created + syncResults.results.islands.existing,
        created: syncResults.results.islands.created,
        existing: syncResults.results.islands.existing,
        errors: syncResults.results.islands.errors
      },
      departments: {
        total: syncResults.results.departments.created + syncResults.results.departments.updated,
        created: syncResults.results.departments.created,
        updated: syncResults.results.departments.updated,
        errors: syncResults.results.departments.errors
      },
      titles: {
        total: syncResults.results.titles.created + syncResults.results.titles.existing,
        created: syncResults.results.titles.created,
        existing: syncResults.results.titles.existing,
        errors: syncResults.results.titles.errors
      },
      employees: {
        total: syncResults.results.employees.created + syncResults.results.employees.updated,
        created: syncResults.results.employees.created,
        updated: syncResults.results.employees.updated,
        errors: syncResults.results.employees.errors
      },
      errors: syncResults.errors.length
    }
    
    console.log('Sync completed:', summary)
    
    return successResponse(res, 'Data sync completed successfully', {
      summary,
      errors: syncResults.errors
    })
    
  } catch (error) {
    console.error('Sync data error:', error)
    
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
      return errorResponse(res, 'Sync operation timed out. Please try with a smaller file or contact administrator.', 408)
    }
    
    return errorResponse(res, 'Failed to sync data: ' + error.message, 500)
  }
}

/**
 * Get sync template CSV
 */
const getSyncTemplate = async (req, res) => {
  try {
    const templateData = [
      {
        'Company Name': 'PT Example Company',
        'Company Address': 'Jl. Example No. 123',
        'Company Email': 'info@example.com',
        'Department Name': 'Human Resources',
        'Department Segmentasi': 'HR',
        'Title Name': 'HR Manager',
        'Island Name': 'Java',
        'Employee Name': 'John Doe',
        'Employee Email': 'john.doe@example.com',
        'Employee Phone': '081234567890',
        'Employee Office Number': '021-12345678',
        'Employee Address': 'Jakarta, Indonesia',
        'Employee Exmail Account': 'john.doe@exmail.example.com',
        'Employee Channel': 'john.doe@example.com',
        'Employee Activation Status': 'Active',
        'Employee Disabled': 'FALSE',
        'Employee WeChat Workplace': 'johndoe_wechat'
      }
    ]
    
    const csvHeader = Object.keys(templateData[0]).join(',')
    const csvRow = Object.values(templateData[0]).map(val => `"${val}"`).join(',')
    const csvContent = csvHeader + '\n' + csvRow
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="sync_data_template.csv"')
    
    return res.status(200).send(csvContent)
    
  } catch (error) {
    console.error('Get sync template error:', error)
    return errorResponse(res, 'Failed to get sync template', 500)
  }
}

module.exports = {
  syncDataHandler,
  getSyncTemplate
}

