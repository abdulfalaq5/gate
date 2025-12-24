const fs = require('fs')
const csv = require('csv-parser')
const { v4: uuidv4 } = require('uuid')
const { pgCore } = require('../../config/database')
const { successResponse, errorResponse } = require('../../utils/response')
const { sanitizeCustomerData } = require('./validation')

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
 * Validate CSV structure for customer import
 */
const validateCSVStructure = (csvData) => {
  const requiredColumns = [
    'cust_name', 'cust_contact_person', 'job_title', 'email', 
    'phone', 'address', 'city', 'state', 'zipcode', 'country'
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
  
  if (missingColumns.length > 0) {
    console.log('CSV validation failed: missing columns', missingColumns)
    return {
      isValid: false,
      errors: [`Missing required columns: ${missingColumns.join(', ')}`]
    }
  }
  
  console.log('CSV structure validation passed')
  return {
    isValid: true,
    errors: [],
    foundColumns
  }
}

/**
 * Extract first email from string (handles multiple emails separated by comma, newline, or space)
 */
const extractFirstEmail = (emailString) => {
  if (!emailString || !emailString.trim()) return null
  
  let email = emailString.trim()
  
  // Remove http://, https://, www. prefixes
  email = email.replace(/^(https?:\/\/)?(www\.)?/i, '')
  
  // Handle multiple emails (comma, newline, or space separated)
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i
  const match = email.match(emailPattern)
  
  if (match) {
    return match[1].toLowerCase()
  }
  
  // If contains @, try to extract email-like string
  if (email.includes('@')) {
    // Take first part before space/comma/newline
    const parts = email.split(/[\s,\n\r]+/)
    for (const part of parts) {
      if (part.includes('@') && part.length > 3) {
        return part.toLowerCase()
      }
    }
  }
  
  return null
}

/**
 * Extract first phone from string (handles multiple phones separated by comma)
 */
const extractFirstPhone = (phoneString) => {
  if (!phoneString || !phoneString.trim()) return null
  
  let phone = phoneString.trim()
  
  // Handle multiple phones (comma separated)
  const phones = phone.split(',').map(p => p.trim()).filter(p => p && p !== '-')
  
  if (phones.length > 0) {
    return phones[0]
  }
  
  return phone
}

/**
 * Map CSV data to customer database format
 */
const mapCSVToCustomerData = (csvRow, foundColumns) => {
  const mapped = {}
  
  // Find the actual column name in CSV (case-insensitive)
  const findColumn = (searchKey) => {
    return foundColumns.find(col => 
      col.toLowerCase().includes(searchKey.toLowerCase()) ||
      searchKey.toLowerCase().includes(col.toLowerCase())
    ) || searchKey
  }
  
  const custNameCol = findColumn('cust_name')
  const contactPersonCol = findColumn('cust_contact_person')
  const jobTitleCol = findColumn('job_title')
  const emailCol = findColumn('email')
  const phoneCol = findColumn('phone')
  const addressCol = findColumn('address')
  const cityCol = findColumn('city')
  const stateCol = findColumn('state')
  const zipcodeCol = findColumn('zipcode')
  const countryCol = findColumn('country')
  
  // Map to database column names - more lenient validation
  if (csvRow[custNameCol]) {
    // Handle multi-line names (take first line, remove quotes)
    let name = csvRow[custNameCol].trim()
    // Remove quotes if present
    name = name.replace(/^["']|["']$/g, '')
    // Take first line if multiple lines
    name = name.split('\n')[0].trim()
    // Remove extra whitespace
    name = name.replace(/\s+/g, ' ')
    
    if (name && name !== '-' && name.length > 0) {
      mapped.customer_name = name
    }
  }
  
  if (csvRow[contactPersonCol]) {
    const contactPerson = csvRow[contactPersonCol].trim()
    if (contactPerson && contactPerson !== '-') {
      mapped.contact_person = contactPerson
    }
  }
  
  if (csvRow[jobTitleCol]) {
    const jobTitle = csvRow[jobTitleCol].trim()
    if (jobTitle && jobTitle !== '-') {
      mapped.job_title = jobTitle
    }
  }
  
  if (csvRow[emailCol]) {
    const email = extractFirstEmail(csvRow[emailCol])
    if (email) {
      mapped.customer_email = email
    }
  }
  
  if (csvRow[phoneCol]) {
    const phone = extractFirstPhone(csvRow[phoneCol])
    if (phone) {
      mapped.customer_phone = phone
    }
  }
  
  if (csvRow[addressCol]) {
    const address = csvRow[addressCol].trim()
    if (address && address !== '-') {
      mapped.customer_address = address
    }
  }
  
  if (csvRow[cityCol]) {
    const city = csvRow[cityCol].trim()
    if (city && city !== '-') {
      mapped.customer_city = city
    }
  }
  
  if (csvRow[stateCol]) {
    const state = csvRow[stateCol].trim()
    if (state && state !== '-') {
      mapped.customer_state = state
    }
  }
  
  if (csvRow[zipcodeCol]) {
    const zipcode = csvRow[zipcodeCol].trim()
    if (zipcode && zipcode !== '-') {
      mapped.customer_zip = zipcode
    }
  }
  
  if (csvRow[countryCol]) {
    const country = csvRow[countryCol].trim()
    if (country && country !== '-') {
      mapped.customer_country = country
    }
  }
  
  return mapped
}

/**
 * Check if customer already exists by name, email, or phone
 */
const checkCustomerExists = async (customerName, customerEmail, customerPhone) => {
  const query = pgCore('customers')
    .where('is_delete', false)
  
  const conditions = []
  
  if (customerName && customerName.trim()) {
    conditions.push(pgCore.raw('LOWER(TRIM(customer_name)) = ?', [customerName.trim().toLowerCase()]))
  }
  
  if (customerEmail && customerEmail.trim()) {
    conditions.push(pgCore.raw('LOWER(TRIM(customer_email)) = ?', [customerEmail.trim().toLowerCase()]))
  }
  
  if (customerPhone && customerPhone.trim()) {
    conditions.push(pgCore.raw('TRIM(customer_phone) = ?', [customerPhone.trim()]))
  }
  
  if (conditions.length === 0) {
    return null
  }
  
  const existingCustomer = await query
    .where(function() {
      for (const condition of conditions) {
        this.orWhere(condition)
      }
    })
    .first()
  
  return existingCustomer
}

/**
 * Import customers from CSV data with batch processing
 */
const importCustomers = async (csvData, foundColumns, createdBy) => {
  try {
    const results = []
    
    // Duplicate checking disabled - no need to pre-load existing customers
    // If you want to enable duplicate checking, uncomment the code below:
    /*
    console.log('Pre-loading existing customers...')
    
    // Pre-load existing customers to avoid duplicate queries
    const existingCustomers = await pgCore('customers')
      .where('is_delete', false)
      .select('customer_id', 'customer_name', 'customer_email', 'customer_phone')
    
    // Create lookup map
    const customersMap = new Map()
    
    existingCustomers.forEach(customer => {
      const key1 = customer.customer_name ? customer.customer_name.trim().toLowerCase() : ''
      const key2 = customer.customer_email ? customer.customer_email.trim().toLowerCase() : ''
      const key3 = customer.customer_phone ? customer.customer_phone.trim() : ''
      
      if (key1) customersMap.set(`name_${key1}`, customer)
      if (key2) customersMap.set(`email_${key2}`, customer)
      if (key3) customersMap.set(`phone_${key3}`, customer)
    })
    */
    
    // Process in batches of 50 to avoid memory issues
    const batchSize = 50
    const totalBatches = Math.ceil(csvData.length / batchSize)
    
    console.log(`Processing ${csvData.length} records in ${totalBatches} batches of ${batchSize}`)
    
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)`)
      
      const customersToInsert = []
      
      for (let batchIdx = 0; batchIdx < batch.length; batchIdx++) {
        const csvRow = batch[batchIdx]
        const rowNumber = i + batchIdx + 1
        
        try {
          // Map CSV data to customer format first
          const customerData = mapCSVToCustomerData(csvRow, foundColumns)
          
          // Generate default customer_name if empty (use contact person, email, phone, or row number)
          if (!customerData.customer_name || !customerData.customer_name.trim()) {
            if (customerData.contact_person && customerData.contact_person.trim()) {
              customerData.customer_name = customerData.contact_person.trim()
            } else if (customerData.customer_email && customerData.customer_email.trim()) {
              customerData.customer_name = customerData.customer_email.trim()
            } else if (customerData.customer_phone && customerData.customer_phone.trim()) {
              customerData.customer_name = `Customer ${customerData.customer_phone.trim()}`
            } else {
              customerData.customer_name = `Customer Row ${rowNumber}`
            }
          }
          
          // Duplicate checking disabled - allow all data to be inserted
          // If you want to enable duplicate checking, uncomment the code below:
          /*
          // Normalize customer name for duplicate checking
          const normalizedName = customerData.customer_name.trim().toLowerCase()
          const nameKey = `name_${normalizedName}`
          
          // Check if exact name exists in database or in current batch
          const existingCustomer = customersMap.get(nameKey)
          
          if (existingCustomer) {
            results.push({
              row: rowNumber,
              status: 'skipped',
              reason: `Customer with name "${customerData.customer_name}" already exists`,
              data: customerData
            })
            continue
          }
          */
          
          // Sanitize customer data
          const sanitizedData = sanitizeCustomerData(customerData)
          
          // Prepare customer for insertion
          const customerId = uuidv4()
          const customerPayload = {
            customer_id: customerId,
            ...sanitizedData,
            created_by: createdBy,
            created_at: new Date().toISOString(),
            is_delete: false
          }
          
          // Store tracking info separately (not in database)
          customerPayload._rowNumber = rowNumber
          customerPayload._originalData = csvRow
          
          customersToInsert.push(customerPayload)
          
          // Duplicate checking disabled - no need to track in map
          // If you want to enable duplicate checking within batch, uncomment the code below:
          /*
          // Add to map to prevent duplicates in same batch (only by name)
          if (customerPayload.customer_name) {
            const normalizedName = customerPayload.customer_name.trim().toLowerCase()
            customersMap.set(`name_${normalizedName}`, { customer_id: customerId })
          }
          */
          
        } catch (error) {
          console.error(`Error processing row ${rowNumber}:`, error)
          // Even on error, try to insert with minimal data
          try {
            const customerId = uuidv4()
            const errorPayload = {
              customer_id: customerId,
              customer_name: `Customer Row ${rowNumber} (Error)`,
              created_by: createdBy,
              created_at: new Date().toISOString(),
              is_delete: false,
              _rowNumber: rowNumber,
              _originalData: csvRow,
              _error: error.message
            }
            customersToInsert.push(errorPayload)
          } catch (insertError) {
            console.error(`Failed to create error payload for row ${rowNumber}:`, insertError)
            results.push({
              row: rowNumber,
              status: 'error',
              reason: error.message || 'Unknown error',
              data: csvRow
            })
          }
        }
      }
      
      // Batch insert customers
      if (customersToInsert.length > 0) {
        try {
          // Remove internal tracking fields before inserting to database
          const customersForInsert = customersToInsert.map(({ _rowNumber, _originalData, _error, ...customer }) => customer)
          
          await pgCore('customers').insert(customersForInsert)
          
          // Add success results - use stored row number
          customersToInsert.forEach((customer) => {
            const rowNumber = customer._rowNumber || (i + 1)
            
            // Remove internal tracking fields before adding to results
            const { _rowNumber, _originalData, _error, ...cleanCustomer } = customer
            
            results.push({
              row: rowNumber,
              status: 'created',
              customer_id: customer.customer_id,
              customer_name: customer.customer_name,
              data: cleanCustomer
            })
          })
          
          console.log(`Batch ${batchNumber} completed: ${customersToInsert.length} customers created`)
        } catch (error) {
          console.error(`Batch insert failed for batch ${batchNumber}:`, error)
          
          // Mark all in batch as error
          customersToInsert.forEach((customer, idx) => {
            results.push({
              row: i + idx + 1,
              status: 'error',
              reason: 'Batch insert failed: ' + error.message,
              data: customer
            })
          })
        }
      }
    }
    
    return results
  } catch (error) {
    console.error('Error importing customers:', error)
    throw error
  }
}

/**
 * Main import function for customers with timeout handling
 */
const importCustomerData = async (req, res) => {
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
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return errorResponse(res, 'Invalid CSV structure', 400, structureValidation.errors)
    }
    
    const createdBy = req.user?.user_id || req.user?.employee_id
    
    // Check if file is too large (more than 1000 records)
    if (csvData.length > 1000) {
      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return errorResponse(res, 'File too large. Maximum 1000 records allowed per import.', 400)
    }
    
    console.log('Starting customer import process...')
    
    // Import customers with timeout
    const importResults = await Promise.race([
      importCustomers(csvData, structureValidation.foundColumns, createdBy),
      timeoutPromise
    ])
    
    // Clear timeout since operation completed
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    const summary = {
      total: importResults.length,
      created: importResults.filter(r => r.status === 'created').length,
      skipped: importResults.filter(r => r.status === 'skipped').length,
      errors: importResults.filter(r => r.status === 'error').length
    }
    
    console.log('Import completed:', summary)
    
    return successResponse(res, {
      summary,
      details: importResults
    }, 'Customer import completed successfully')
    
  } catch (error) {
    // Clear timeout if still active
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    console.error('Customer import error:', error)
    return errorResponse(res, error.message || 'Failed to import customers', 500)
  }
}

module.exports = {
  importCustomerData
}

