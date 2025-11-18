const { candidatesColumns } = require('./column')

/**
 * Validate candidate data for different operations
 */
const validateCandidate = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (data.candidate_name && data.candidate_name.length > 255) {
      errors.push('Candidate name must not exceed 255 characters')
    }
    
    if (data.candidate_email && !isValidEmail(data.candidate_email)) {
      errors.push('Invalid email format')
    }
    
    if (data.candidate_email && data.candidate_email.length > 255) {
      errors.push('Candidate email must not exceed 255 characters')
    }
    
    if (data.candidate_phone && data.candidate_phone.length > 255) {
      errors.push('Candidate phone must not exceed 255 characters')
    }
    
    if (data.candidate_religion && data.candidate_religion.length > 255) {
      errors.push('Candidate religion must not exceed 255 characters')
    }
    
    if (data.candidate_gender && data.candidate_gender.length > 255) {
      errors.push('Candidate gender must not exceed 255 characters')
    }
    
    if (data.candidate_marital_status && data.candidate_marital_status.length > 255) {
      errors.push('Candidate marital status must not exceed 255 characters')
    }
    
    if (data.candidate_age !== undefined && data.candidate_age !== null && (isNaN(data.candidate_age) || data.candidate_age < 0)) {
      errors.push('Candidate age must be a positive number')
    }
    
    if (data.candidate_nationality && data.candidate_nationality.length > 255) {
      errors.push('Candidate nationality must not exceed 255 characters')
    }
    
    if (data.candidate_city && data.candidate_city.length > 255) {
      errors.push('Candidate city must not exceed 255 characters')
    }
    
    if (data.candidate_state && data.candidate_state.length > 255) {
      errors.push('Candidate state must not exceed 255 characters')
    }
    
    if (data.candidate_country && data.candidate_country.length > 255) {
      errors.push('Candidate country must not exceed 255 characters')
    }
    
    if (data.candidate_number && data.candidate_number.length > 255) {
      errors.push('Candidate number must not exceed 255 characters')
    }
  }
  
  if (operation === 'update') {
    if (data.candidate_name !== undefined && data.candidate_name && data.candidate_name.length > 255) {
      errors.push('Candidate name must not exceed 255 characters')
    }
    
    if (data.candidate_email !== undefined && data.candidate_email && !isValidEmail(data.candidate_email)) {
      errors.push('Invalid email format')
    }
    
    if (data.candidate_email !== undefined && data.candidate_email && data.candidate_email.length > 255) {
      errors.push('Candidate email must not exceed 255 characters')
    }
    
    if (data.candidate_phone !== undefined && data.candidate_phone && data.candidate_phone.length > 255) {
      errors.push('Candidate phone must not exceed 255 characters')
    }
    
    if (data.candidate_religion !== undefined && data.candidate_religion && data.candidate_religion.length > 255) {
      errors.push('Candidate religion must not exceed 255 characters')
    }
    
    if (data.candidate_gender !== undefined && data.candidate_gender && data.candidate_gender.length > 255) {
      errors.push('Candidate gender must not exceed 255 characters')
    }
    
    if (data.candidate_marital_status !== undefined && data.candidate_marital_status && data.candidate_marital_status.length > 255) {
      errors.push('Candidate marital status must not exceed 255 characters')
    }
    
    if (data.candidate_age !== undefined && data.candidate_age !== null && (isNaN(data.candidate_age) || data.candidate_age < 0)) {
      errors.push('Candidate age must be a positive number')
    }
    
    if (data.candidate_nationality !== undefined && data.candidate_nationality && data.candidate_nationality.length > 255) {
      errors.push('Candidate nationality must not exceed 255 characters')
    }
    
    if (data.candidate_city !== undefined && data.candidate_city && data.candidate_city.length > 255) {
      errors.push('Candidate city must not exceed 255 characters')
    }
    
    if (data.candidate_state !== undefined && data.candidate_state && data.candidate_state.length > 255) {
      errors.push('Candidate state must not exceed 255 characters')
    }
    
    if (data.candidate_country !== undefined && data.candidate_country && data.candidate_country.length > 255) {
      errors.push('Candidate country must not exceed 255 characters')
    }
    
    if (data.candidate_number !== undefined && data.candidate_number && data.candidate_number.length > 255) {
      errors.push('Candidate number must not exceed 255 characters')
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
 * Sanitize candidate data
 */
const sanitizeCandidateData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.candidate_name) {
    sanitized.candidate_name = sanitized.candidate_name.trim()
  }
  
  if (sanitized.candidate_email) {
    sanitized.candidate_email = sanitized.candidate_email.trim().toLowerCase()
  }
  
  if (sanitized.candidate_phone) {
    sanitized.candidate_phone = sanitized.candidate_phone.trim()
  }
  
  if (sanitized.candidate_religion) {
    sanitized.candidate_religion = sanitized.candidate_religion.trim()
  }
  
  if (sanitized.candidate_gender) {
    sanitized.candidate_gender = sanitized.candidate_gender.trim()
  }
  
  if (sanitized.candidate_marital_status) {
    sanitized.candidate_marital_status = sanitized.candidate_marital_status.trim()
  }
  
  if (sanitized.candidate_nationality) {
    sanitized.candidate_nationality = sanitized.candidate_nationality.trim()
  }
  
  if (sanitized.candidate_city) {
    sanitized.candidate_city = sanitized.candidate_city.trim()
  }
  
  if (sanitized.candidate_state) {
    sanitized.candidate_state = sanitized.candidate_state.trim()
  }
  
  if (sanitized.candidate_country) {
    sanitized.candidate_country = sanitized.candidate_country.trim()
  }
  
  if (sanitized.candidate_address) {
    sanitized.candidate_address = sanitized.candidate_address.trim()
  }
  
  if (sanitized.candidate_number) {
    sanitized.candidate_number = sanitized.candidate_number.trim()
  }
  
  return sanitized
}

module.exports = {
  validateCandidate,
  sanitizeCandidateData
}

