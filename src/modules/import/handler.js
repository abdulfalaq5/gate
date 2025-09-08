const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const { successResponse, errorResponse } = require('../../utils/response')
const companiesRepository = require('../companies/postgre_repository')
const departmentsRepository = require('../departments/postgre_repository')
const titlesRepository = require('../titles/postgre_repository')

/**
 * Parse CSV file and return data
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}

/**
 * Validate CSV structure
 */
const validateCSVStructure = (data) => {
  const errors = []
  
  if (!data || data.length === 0) {
    errors.push('CSV file is empty')
    return { isValid: false, errors }
  }
  
  const firstRow = data[0]
  const requiredColumns = ['Companies', 'Departements', 'Titles']
  
  requiredColumns.forEach(column => {
    if (!(column in firstRow)) {
      errors.push(`Missing required column: ${column}`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check for duplicate companies
 */
const checkDuplicateCompanies = async (companies) => {
  const duplicates = []
  const uniqueCompanies = [...new Set(companies.filter(c => c && c.trim()))]
  
  for (const company of uniqueCompanies) {
    const existingCompany = await companiesRepository.getCompanyByName(company.trim())
    if (existingCompany) {
      duplicates.push({
        type: 'company',
        name: company,
        message: `Company "${company}" already exists`
      })
    }
  }
  
  return duplicates
}

/**
 * Check for duplicate departments
 */
const checkDuplicateDepartments = async (departments) => {
  const duplicates = []
  const uniqueDepartments = [...new Set(departments.filter(d => d && d.trim()))]
  
  for (const department of uniqueDepartments) {
    const existingDepartment = await departmentsRepository.getDepartmentByName(department.trim())
    if (existingDepartment) {
      duplicates.push({
        type: 'department',
        name: department,
        message: `Department "${department}" already exists`
      })
    }
  }
  
  return duplicates
}

/**
 * Check for duplicate titles
 */
const checkDuplicateTitles = async (titles) => {
  const duplicates = []
  const uniqueTitles = [...new Set(titles.filter(t => t && t.trim()))]
  
  for (const title of uniqueTitles) {
    const existingTitle = await titlesRepository.getTitleByName(title.trim())
    if (existingTitle) {
      duplicates.push({
        type: 'title',
        name: title,
        message: `Title "${title}" already exists`
      })
    }
  }
  
  return duplicates
}

/**
 * Import companies from CSV data
 */
const importCompanies = async (companies, createdBy) => {
  const results = []
  const uniqueCompanies = [...new Set(companies.filter(c => c && c.trim()))]
  
  for (const companyName of uniqueCompanies) {
    try {
      const companyData = {
        company_name: companyName.trim(),
        created_by: createdBy
      }
      
      const company = await companiesRepository.createCompany(companyData)
      results.push({
        type: 'company',
        name: companyName,
        id: company.company_id,
        status: 'created'
      })
    } catch (error) {
      results.push({
        type: 'company',
        name: companyName,
        status: 'error',
        error: error.message
      })
    }
  }
  
  return results
}

/**
 * Import departments from CSV data
 */
const importDepartments = async (departments, companyId, createdBy) => {
  const results = []
  const uniqueDepartments = [...new Set(departments.filter(d => d && d.trim()))]
  
  for (const departmentName of uniqueDepartments) {
    try {
      const departmentData = {
        department_name: departmentName.trim(),
        company_id: companyId,
        created_by: createdBy
      }
      
      const department = await departmentsRepository.createDepartment(departmentData)
      results.push({
        type: 'department',
        name: departmentName,
        id: department.department_id,
        status: 'created'
      })
    } catch (error) {
      results.push({
        type: 'department',
        name: departmentName,
        status: 'error',
        error: error.message
      })
    }
  }
  
  return results
}

/**
 * Import titles from CSV data
 */
const importTitles = async (titles, departmentId, createdBy) => {
  const results = []
  const uniqueTitles = [...new Set(titles.filter(t => t && t.trim()))]
  
  for (const titleName of uniqueTitles) {
    try {
      const titleData = {
        title_name: titleName.trim(),
        department_id: departmentId,
        created_by: createdBy
      }
      
      const title = await titlesRepository.createTitle(titleData)
      results.push({
        type: 'title',
        name: titleName,
        id: title.title_id,
        status: 'created'
      })
    } catch (error) {
      results.push({
        type: 'title',
        name: titleName,
        status: 'error',
        error: error.message
      })
    }
  }
  
  return results
}

/**
 * Main import function
 */
const importMasterData = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No CSV file uploaded', 400)
    }
    
    const filePath = req.file.path
    
    // Parse CSV
    const csvData = await parseCSV(filePath)
    
    // Validate CSV structure
    const structureValidation = validateCSVStructure(csvData)
    if (!structureValidation.isValid) {
      // Clean up uploaded file
      fs.unlinkSync(filePath)
      return errorResponse(res, 'Invalid CSV structure', 400, structureValidation.errors)
    }
    
    // Extract data from CSV
    const companies = csvData.map(row => row.Companies).filter(c => c && c.trim())
    const departments = csvData.map(row => row.Departements).filter(d => d && d.trim())
    const titles = csvData.map(row => row.Titles).filter(t => t && t.trim())
    
    // Check for duplicates
    const companyDuplicates = await checkDuplicateCompanies(companies)
    const departmentDuplicates = await checkDuplicateDepartments(departments)
    const titleDuplicates = await checkDuplicateTitles(titles)
    
    const allDuplicates = [...companyDuplicates, ...departmentDuplicates, ...titleDuplicates]
    
    if (allDuplicates.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath)
      return errorResponse(res, 'Duplicate data found', 400, allDuplicates)
    }
    
    const createdBy = req.user?.user_id
    const importResults = []
    
    // Import companies first
    const companyResults = await importCompanies(companies, createdBy)
    importResults.push(...companyResults)
    
    // Get the first company ID for departments (assuming single company import)
    const createdCompanies = companyResults.filter(r => r.status === 'created')
    if (createdCompanies.length > 0) {
      const companyId = createdCompanies[0].id
      
      // Import departments
      const departmentResults = await importDepartments(departments, companyId, createdBy)
      importResults.push(...departmentResults)
      
      // Get the first department ID for titles (assuming single department import)
      const createdDepartments = departmentResults.filter(r => r.status === 'created')
      if (createdDepartments.length > 0) {
        const departmentId = createdDepartments[0].id
        
        // Import titles
        const titleResults = await importTitles(titles, departmentId, createdBy)
        importResults.push(...titleResults)
      }
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath)
    
    // Count results
    const successCount = importResults.filter(r => r.status === 'created').length
    const errorCount = importResults.filter(r => r.status === 'error').length
    
    return successResponse(res, {
      summary: {
        totalProcessed: importResults.length,
        successCount,
        errorCount
      },
      details: importResults
    }, `Import completed. ${successCount} records created, ${errorCount} errors`)
    
  } catch (error) {
    console.error('Error importing master data:', error)
    
    // Clean up uploaded file if exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError)
      }
    }
    
    return errorResponse(res, 'Failed to import master data', 500)
  }
}

/**
 * Get import template
 */
const getImportTemplate = async (req, res) => {
  try {
    const template = {
      headers: ['Companies', 'Departements', 'Titles'],
      sampleData: [
        ['PT. Example Company', 'Human Resources', 'HR Manager'],
        ['PT. Example Company', 'IT Department', 'Software Developer'],
        ['PT. Example Company', 'Finance', 'Accountant']
      ],
      instructions: [
        'First column: Company names',
        'Second column: Department names',
        'Third column: Title/Position names',
        'Each row represents a company-department-title relationship',
        'Empty cells will be skipped',
        'Duplicate data will be rejected'
      ]
    }
    
    return successResponse(res, template, 'Import template retrieved successfully')
  } catch (error) {
    console.error('Error getting import template:', error)
    return errorResponse(res, 'Failed to get import template', 500)
  }
}

module.exports = {
  importMasterData,
  getImportTemplate
}
