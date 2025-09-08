const { departmentsColumns } = require('./column')

/**
 * Validate department data for different operations
 */
const validateDepartment = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (!data.department_name || data.department_name.trim().length < 2) {
      errors.push('Department name is required and must be at least 2 characters')
    }
    
    if (data.department_name && data.department_name.length > 100) {
      errors.push('Department name must not exceed 100 characters')
    }
    
    if (!data.company_id) {
      errors.push('Company ID is required')
    }
  }
  
  if (operation === 'update') {
    if (data.department_name !== undefined) {
      if (!data.department_name || data.department_name.trim().length < 2) {
        errors.push('Department name must be at least 2 characters')
      }
      
      if (data.department_name.length > 100) {
        errors.push('Department name must not exceed 100 characters')
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize department data
 */
const sanitizeDepartmentData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.department_name) {
    sanitized.department_name = sanitized.department_name.trim()
  }
  
  return sanitized
}

module.exports = {
  validateDepartment,
  sanitizeDepartmentData
}
