const { noteColumns } = require('./column')
const { validateRequest } = require('../../utils/validation')

/**
 * Validate note data for different operations
 */
const validateNote = (data, operation = 'create') => {
  const errors = []
  
  // Validate candidate_id if provided
  if (data.candidate_id !== undefined && data.candidate_id !== null && data.candidate_id !== '') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(data.candidate_id)) {
      errors.push('candidate_id must be a valid UUID')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize note data
 */
const sanitizeNoteData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.notes) {
    sanitized.notes = sanitized.notes.trim()
  }
  
  if (sanitized.noted_description) {
    sanitized.noted_description = sanitized.noted_description.trim()
  }
  
  // Handle candidate_id: convert empty string, null, or 'nan' to null
  if (sanitized.candidate_id === '' || sanitized.candidate_id === null || 
      sanitized.candidate_id === 'null' || sanitized.candidate_id === 'nan' ||
      sanitized.candidate_id === 'NaN') {
    sanitized.candidate_id = null
  }
  
  return sanitized
}

module.exports = {
  validateNote,
  sanitizeNoteData,
  noteColumns
}

