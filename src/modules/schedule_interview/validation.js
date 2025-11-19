const { scheduleInterviewColumns } = require('./column')

/**
 * Validate schedule interview data for different operations
 */
const validateScheduleInterview = (data, operation = 'create') => {
  const errors = []
  
  if (operation === 'create') {
    if (data.assign_role && data.assign_role.length > 255) {
      errors.push('Assign role must not exceed 255 characters')
    }
    
    if (data.schedule_interview_duration && data.schedule_interview_duration.length > 255) {
      errors.push('Schedule interview duration must not exceed 255 characters')
    }
  }
  
  if (operation === 'update') {
    if (data.assign_role !== undefined && data.assign_role && data.assign_role.length > 255) {
      errors.push('Assign role must not exceed 255 characters')
    }
    
    if (data.schedule_interview_duration !== undefined && data.schedule_interview_duration && data.schedule_interview_duration.length > 255) {
      errors.push('Schedule interview duration must not exceed 255 characters')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize schedule interview data
 */
const sanitizeScheduleInterviewData = (data) => {
  const sanitized = { ...data }
  
  if (sanitized.assign_role) {
    sanitized.assign_role = sanitized.assign_role.trim()
  }
  
  if (sanitized.schedule_interview_duration) {
    sanitized.schedule_interview_duration = sanitized.schedule_interview_duration.trim()
  }
  
  if (sanitized.schedule_interview_description) {
    sanitized.schedule_interview_description = sanitized.schedule_interview_description.trim()
  }
  
  return sanitized
}

module.exports = {
  validateScheduleInterview,
  sanitizeScheduleInterviewData
}

