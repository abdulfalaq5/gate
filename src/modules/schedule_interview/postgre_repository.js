const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get schedule interviews with pagination and filtering menggunakan sistem filter standar
 * Include relasi: candidate, company, department, title
 */
const getScheduleInterviews = async (queryParams) => {
  // Base query untuk schedule_interviews
  const baseQuery = pgCore('schedule_interviews')
    .select('schedule_interviews.*')
    .where('schedule_interviews.is_delete', false)
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [scheduleInterviews, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Load relasi untuk setiap schedule interview
  const scheduleInterviewsWithRelations = await Promise.all(
    scheduleInterviews.map(async (scheduleInterview) => {
      // Get candidate relation if exists
      if (scheduleInterview.candidate_id) {
        const candidate = await pgCore('candidates')
          .select('candidates.*')
          .where('candidates.candidate_id', scheduleInterview.candidate_id)
          .where('candidates.is_delete', false)
          .first()
        
        if (candidate) {
          scheduleInterview.candidate = candidate
          
          // Get company relation if exists
          if (candidate.company_id) {
            const company = await pgCore('companies')
              .select('company_id', 'company_name', 'company_address', 'company_email')
              .where('company_id', candidate.company_id)
              .where('is_delete', false)
              .first()
            
            if (company) {
              scheduleInterview.candidate.company = company
            }
          }
          
          // Get department relation if exists
          if (candidate.department_id) {
            const department = await pgCore('departments')
              .select('department_id', 'department_name', 'department_parent_id', 'company_id')
              .where('department_id', candidate.department_id)
              .where('is_delete', false)
              .first()
            
            if (department) {
              scheduleInterview.candidate.department = department
            }
          }
          
          // Get title relation if exists
          if (candidate.title_id) {
            const title = await pgCore('titles')
              .select('title_id', 'title_name')
              .where('title_id', candidate.title_id)
              .where('is_delete', false)
              .first()
            
            if (title) {
              scheduleInterview.candidate.title = title
            }
          }
        }
      }
      
      return scheduleInterview
    })
  )
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(scheduleInterviewsWithRelations, queryParams.pagination, countResult.total)
}

/**
 * Get candidates for schedule interview (untuk endpoint /get)
 */
const getCandidates = async (queryParams) => {
  // Base query untuk candidates
  const baseQuery = pgCore('candidates')
    .select('candidates.*')
    .where('candidates.is_delete', false)
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [candidates, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(candidates, queryParams.pagination, countResult.total)
}

/**
 * Get schedule interview by ID with all relations
 */
const getScheduleInterviewById = async (id) => {
  const scheduleInterview = await pgCore('schedule_interviews')
    .select('schedule_interviews.*')
    .where('schedule_interviews.schedule_interview_id', id)
    .where('schedule_interviews.is_delete', false)
    .first()
  
  if (!scheduleInterview) {
    return null
  }
  
  // Get candidate relation if exists
  if (scheduleInterview.candidate_id) {
    const candidate = await pgCore('candidates')
      .select('candidates.*')
      .where('candidates.candidate_id', scheduleInterview.candidate_id)
      .where('candidates.is_delete', false)
      .first()
    
    if (candidate) {
      scheduleInterview.candidate = candidate
      
      // Get company relation if exists
      if (candidate.company_id) {
        const company = await pgCore('companies')
          .select('company_id', 'company_name', 'company_address', 'company_email')
          .where('company_id', candidate.company_id)
          .where('is_delete', false)
          .first()
        
        if (company) {
          scheduleInterview.candidate.company = company
        }
      }
      
      // Get department relation if exists
      if (candidate.department_id) {
        const department = await pgCore('departments')
          .select('department_id', 'department_name', 'department_parent_id', 'company_id')
          .where('department_id', candidate.department_id)
          .where('is_delete', false)
          .first()
        
        if (department) {
          scheduleInterview.candidate.department = department
        }
      }
      
      // Get title relation if exists
      if (candidate.title_id) {
        const title = await pgCore('titles')
          .select('title_id', 'title_name')
          .where('title_id', candidate.title_id)
          .where('is_delete', false)
          .first()
        
        if (title) {
          scheduleInterview.candidate.title = title
        }
      }
    }
  }
  
  return scheduleInterview
}

/**
 * Create new schedule interview
 */
const createScheduleInterview = async (scheduleInterviewData) => {
  const [scheduleInterview] = await pgCore('schedule_interviews')
    .insert({
      ...scheduleInterviewData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return scheduleInterview
}

/**
 * Update schedule interview
 */
const updateScheduleInterview = async (id, scheduleInterviewData) => {
  const [scheduleInterview] = await pgCore('schedule_interviews')
    .where('schedule_interview_id', id)
    .update({
      ...scheduleInterviewData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return scheduleInterview
}

/**
 * Soft delete schedule interview
 */
const deleteScheduleInterview = async (id, deletedBy) => {
  const [scheduleInterview] = await pgCore('schedule_interviews')
    .where('schedule_interview_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return scheduleInterview
}

module.exports = {
  getScheduleInterviews,
  getCandidates,
  getScheduleInterviewById,
  createScheduleInterview,
  updateScheduleInterview,
  deleteScheduleInterview
}

