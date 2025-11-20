const { interviewColumns } = require('./column')

/**
 * Validate interview data for different operations
 */
const validateInterview = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (data.interview_company_value && data.interview_company_value.length > 255) {
      errors.push('Interview company value must not exceed 255 characters')
    }
    
    if (data.interview_comment && data.interview_comment.length > 255) {
      errors.push('Interview comment must not exceed 255 characters')
    }
    
    if (data.interview_total_score && data.interview_total_score.length > 255) {
      errors.push('Interview total score must not exceed 255 characters')
    }
    
    if (data.interview_description && data.interview_description.length > 255) {
      errors.push('Interview description must not exceed 255 characters')
    }
  }
  
  if (operation === 'update') {
    if (data.interview_company_value !== undefined && data.interview_company_value && data.interview_company_value.length > 255) {
      errors.push('Interview company value must not exceed 255 characters')
    }
    
    if (data.interview_comment !== undefined && data.interview_comment && data.interview_comment.length > 255) {
      errors.push('Interview comment must not exceed 255 characters')
    }
    
    if (data.interview_total_score !== undefined && data.interview_total_score && data.interview_total_score.length > 255) {
      errors.push('Interview total score must not exceed 255 characters')
    }
    
    if (data.interview_description !== undefined && data.interview_description && data.interview_description.length > 255) {
      errors.push('Interview description must not exceed 255 characters')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate detail interview data
 */
const validateDetailInterview = (detail) => {
  const errors = []
  
  if (detail.aspect && detail.aspect.length > 255) {
    errors.push('Detail interview aspect must not exceed 255 characters')
  }
  
  if (detail.question && detail.question.length > 255) {
    errors.push('Detail interview question must not exceed 255 characters')
  }
  
  if (detail.answer && detail.answer.length > 255) {
    errors.push('Detail interview answer must not exceed 255 characters')
  }
  
  if (detail.score && String(detail.score).length > 255) {
    errors.push('Detail interview score must not exceed 255 characters')
  }
  
  if (detail.description && detail.description.length > 255) {
    errors.push('Detail interview description must not exceed 255 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize interview data
 */
const sanitizeInterviewData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.interview_company_value) {
    sanitized.interview_company_value = sanitized.interview_company_value.trim()
  }
  
  if (sanitized.interview_comment) {
    sanitized.interview_comment = sanitized.interview_comment.trim()
  }
  
  if (sanitized.interview_total_score) {
    sanitized.interview_total_score = String(sanitized.interview_total_score).trim()
  }
  
  if (sanitized.interview_description) {
    sanitized.interview_description = sanitized.interview_description.trim()
  }
  
  return sanitized
}

/**
 * Sanitize detail interview data
 */
const sanitizeDetailInterviewData = (detail) => {
  const sanitized = { ...detail }
  
  if (sanitized.aspect) {
    sanitized.aspect = sanitized.aspect.trim()
  }
  
  if (sanitized.question) {
    sanitized.question = sanitized.question.trim()
  }
  
  if (sanitized.answer) {
    sanitized.answer = sanitized.answer.trim()
  }
  
  if (sanitized.score !== undefined && sanitized.score !== null) {
    sanitized.score = String(sanitized.score).trim()
  }
  
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim()
  }
  
  return sanitized
}

module.exports = {
  validateInterview,
  validateDetailInterview,
  sanitizeInterviewData,
  sanitizeDetailInterviewData
}

