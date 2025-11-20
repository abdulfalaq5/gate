const { backgroundCheckColumns } = require('./column')
const { validateRequest } = require('../../utils/validation')

/**
 * Validate background check data for different operations
 */
const validateBackgroundCheck = (data, operation = 'create') => {
  const errors = []
  
  // Validate background_status enum
  if (data.background_status && !['hired', 'rejected', 'hold'].includes(data.background_status)) {
    errors.push('background_status must be one of: hired, rejected, hold')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize background check data
 */
const sanitizeBackgroundCheckData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.background_check_note) {
    sanitized.background_check_note = sanitized.background_check_note.trim()
  }
  
  if (sanitized.background_description) {
    sanitized.background_description = sanitized.background_description.trim()
  }
  
  if (sanitized.background_status) {
    sanitized.background_status = sanitized.background_status.trim().toLowerCase()
  }
  
  return sanitized
}

module.exports = {
  validateBackgroundCheck,
  sanitizeBackgroundCheckData,
  backgroundCheckColumns
}

