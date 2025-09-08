const { companiesColumns } = require('./column')

/**
 * Validate company data for different operations
 */
const validateCompany = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (!data.company_name || data.company_name.trim().length < 2) {
      errors.push('Company name is required and must be at least 2 characters')
    }
    
    if (data.company_name && data.company_name.length > 100) {
      errors.push('Company name must not exceed 100 characters')
    }
    
    if (data.company_email && !isValidEmail(data.company_email)) {
      errors.push('Invalid email format')
    }
    
    if (data.company_email && data.company_email.length > 100) {
      errors.push('Company email must not exceed 100 characters')
    }
  }
  
  if (operation === 'update') {
    if (data.company_name !== undefined) {
      if (!data.company_name || data.company_name.trim().length < 2) {
        errors.push('Company name must be at least 2 characters')
      }
      
      if (data.company_name.length > 100) {
        errors.push('Company name must not exceed 100 characters')
      }
    }
    
    if (data.company_email !== undefined) {
      if (data.company_email && !isValidEmail(data.company_email)) {
        errors.push('Invalid email format')
      }
      
      if (data.company_email && data.company_email.length > 100) {
        errors.push('Company email must not exceed 100 characters')
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize company data
 */
const sanitizeCompanyData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.company_name) {
    sanitized.company_name = sanitized.company_name.trim()
  }
  
  if (sanitized.company_address) {
    sanitized.company_address = sanitized.company_address.trim()
  }
  
  if (sanitized.company_email) {
    sanitized.company_email = sanitized.company_email.trim().toLowerCase()
  }
  
  return sanitized
}

/**
 * Validate company hierarchy (prevent circular references)
 */
const validateCompanyHierarchy = async (companyId, parentId, repository) => {
  if (!parentId) return { isValid: true }
  
  if (companyId === parentId) {
    return { isValid: false, error: 'Company cannot be its own parent' }
  }
  
  // Check if parent exists
  const parent = await repository.getCompanyById(parentId)
  if (!parent) {
    return { isValid: false, error: 'Parent company not found' }
  }
  
  // Check for circular reference
  let currentParent = parent
  while (currentParent.company_parent_id) {
    if (currentParent.company_parent_id === companyId) {
      return { isValid: false, error: 'Circular reference detected' }
    }
    currentParent = await repository.getCompanyById(currentParent.company_parent_id)
  }
  
  return { isValid: true }
}

module.exports = {
  validateCompany,
  sanitizeCompanyData,
  validateCompanyHierarchy
}
