const { customersColumns } = require('./column')

/**
 * Validate customer data for different operations
 */
const validateCustomer = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (data.customer_name && data.customer_name.length > 255) {
      errors.push('Customer name must not exceed 255 characters')
    }
    
    if (data.customer_email && !isValidEmail(data.customer_email)) {
      errors.push('Invalid email format')
    }
    
    if (data.customer_email && data.customer_email.length > 255) {
      errors.push('Customer email must not exceed 255 characters')
    }
    
    if (data.customer_phone && data.customer_phone.length > 255) {
      errors.push('Customer phone must not exceed 255 characters')
    }
    
    if (data.job_title && data.job_title.length > 255) {
      errors.push('Customer job title must not exceed 255 characters')
    }
    
    if (data.customer_city && data.customer_city.length > 255) {
      errors.push('Customer city must not exceed 255 characters')
    }
    
    if (data.customer_state && data.customer_state.length > 255) {
      errors.push('Customer state must not exceed 255 characters')
    }
    
    if (data.customer_zip && data.customer_zip.length > 255) {
      errors.push('Customer zip must not exceed 255 characters')
    }
    
    if (data.customer_country && data.customer_country.length > 255) {
      errors.push('Customer country must not exceed 255 characters')
    }
  }
  
  if (operation === 'update') {
    if (data.customer_name !== undefined && data.customer_name && data.customer_name.length > 255) {
      errors.push('Customer name must not exceed 255 characters')
    }
    
    if (data.customer_email !== undefined && data.customer_email && !isValidEmail(data.customer_email)) {
      errors.push('Invalid email format')
    }
    
    if (data.customer_email !== undefined && data.customer_email && data.customer_email.length > 255) {
      errors.push('Customer email must not exceed 255 characters')
    }
    
    if (data.customer_phone !== undefined && data.customer_phone && data.customer_phone.length > 255) {
      errors.push('Customer phone must not exceed 255 characters')
    }
    
    if (data.job_title !== undefined && data.job_title && data.job_title.length > 255) {
      errors.push('Customer job title must not exceed 255 characters')
    }
    
    if (data.customer_city !== undefined && data.customer_city && data.customer_city.length > 255) {
      errors.push('Customer city must not exceed 255 characters')
    }
    
    if (data.customer_state !== undefined && data.customer_state && data.customer_state.length > 255) {
      errors.push('Customer state must not exceed 255 characters')
    }
    
    if (data.customer_zip !== undefined && data.customer_zip && data.customer_zip.length > 255) {
      errors.push('Customer zip must not exceed 255 characters')
    }
    
    if (data.customer_country !== undefined && data.customer_country && data.customer_country.length > 255) {
      errors.push('Customer country must not exceed 255 characters')
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
 * Sanitize customer data
 */
const sanitizeCustomerData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.customer_name) {
    sanitized.customer_name = sanitized.customer_name.trim()
  }
  
  if (sanitized.customer_email) {
    sanitized.customer_email = sanitized.customer_email.trim().toLowerCase()
  }
  
  if (sanitized.customer_phone) {
    sanitized.customer_phone = sanitized.customer_phone.trim()
  }
  
  if (sanitized.job_title) {
    sanitized.job_title = sanitized.job_title.trim()
  }
  
  if (sanitized.customer_address) {
    sanitized.customer_address = sanitized.customer_address.trim()
  }
  
  if (sanitized.customer_city) {
    sanitized.customer_city = sanitized.customer_city.trim()
  }
  
  if (sanitized.customer_state) {
    sanitized.customer_state = sanitized.customer_state.trim()
  }
  
  if (sanitized.customer_zip) {
    sanitized.customer_zip = sanitized.customer_zip.trim()
  }
  
  if (sanitized.customer_country) {
    sanitized.customer_country = sanitized.customer_country.trim()
  }
  
  return sanitized
}

module.exports = {
  validateCustomer,
  sanitizeCustomerData
}
