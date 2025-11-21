const { onBoardDocumentColumns } = require('./column')
const { validateRequest } = require('../../utils/validation')

/**
 * Validate on board document data for different operations
 */
const validateOnBoardDocument = (data, operation = 'create') => {
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
 * Sanitize on board document data
 */
const sanitizeOnBoardDocumentData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.on_board_document_name) {
    sanitized.on_board_document_name = sanitized.on_board_document_name.trim()
  }
  
  if (sanitized.on_board_document_description) {
    sanitized.on_board_document_description = sanitized.on_board_document_description.trim()
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
  validateOnBoardDocument,
  sanitizeOnBoardDocumentData,
  onBoardDocumentColumns
}

