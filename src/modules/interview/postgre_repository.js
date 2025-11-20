const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get candidates for interview (untuk endpoint /get)
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
  
  // Ensure countResult has total
  const total = countResult && countResult.total ? parseInt(countResult.total) : 0
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(candidates || [], queryParams.pagination, total)
}

/**
 * Get interview by ID with all relations (detail_interviews)
 */
const getInterviewById = async (id) => {
  const interview = await pgCore('interviews')
    .select('interviews.*')
    .where('interviews.interview_id', id)
    .where('interviews.is_delete', false)
    .first()
  
  if (!interview) {
    return null
  }
  
  // Get detail_interviews relation
  const detailInterviews = await pgCore('detail_interviews')
    .select('detail_interviews.*')
    .where('detail_interviews.interview_id', interview.interview_id)
    .where('detail_interviews.is_delete', false)
    .orderBy('detail_interviews.created_at', 'asc')
  
  interview.detail_interviews = detailInterviews
  
  // Get schedule_interview relation if exists
  if (interview.schedule_interview_id) {
    const scheduleInterview = await pgCore('schedule_interviews')
      .select('schedule_interviews.*')
      .where('schedule_interviews.schedule_interview_id', interview.schedule_interview_id)
      .where('schedule_interviews.is_delete', false)
      .first()
    
    if (scheduleInterview) {
      interview.schedule_interview = scheduleInterview
      
      // Get candidate relation if exists
      if (scheduleInterview.candidate_id) {
        const candidate = await pgCore('candidates')
          .select('candidates.*')
          .where('candidates.candidate_id', scheduleInterview.candidate_id)
          .where('candidates.is_delete', false)
          .first()
        
        if (candidate) {
          interview.schedule_interview.candidate = candidate
        }
      }
    }
  }
  
  return interview
}

/**
 * Create new interview with detail_interviews
 */
const createInterview = async (interviewData, detailInterviewsData = [], userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Insert interview
    const [interview] = await trx('interviews')
      .insert({
        ...interviewData,
        employee_id: userId, // Set employee_id from token
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    // Insert detail_interviews if provided
    if (detailInterviewsData && detailInterviewsData.length > 0) {
      const detailInterviewsToInsert = detailInterviewsData.map(detail => ({
        interview_id: interview.interview_id,
        detail_interview_aspect: detail.aspect,
        detail_interview_question: detail.question,
        detail_interview_answer: detail.answer,
        detail_interview_score: detail.score ? String(detail.score) : null,
        detail_interview_description: detail.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        is_delete: false
      }))
      
      await trx('detail_interviews').insert(detailInterviewsToInsert)
    }
    
    await trx.commit()
    
    // Get full interview with relations
    return await getInterviewById(interview.interview_id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Update interview with detail_interviews
 */
const updateInterview = async (id, interviewData, detailInterviewsData = [], userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Update interview
    const [interview] = await trx('interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        ...interviewData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    if (!interview) {
      throw new Error('Interview not found')
    }
    
    // Soft delete existing detail_interviews
    await trx('detail_interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
    
    // Insert new detail_interviews if provided
    if (detailInterviewsData && detailInterviewsData.length > 0) {
      const detailInterviewsToInsert = detailInterviewsData.map(detail => ({
        interview_id: id,
        detail_interview_aspect: detail.aspect,
        detail_interview_question: detail.question,
        detail_interview_answer: detail.answer,
        detail_interview_score: detail.score ? String(detail.score) : null,
        detail_interview_description: detail.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        is_delete: false
      }))
      
      await trx('detail_interviews').insert(detailInterviewsToInsert)
    }
    
    await trx.commit()
    
    // Get full interview with relations
    return await getInterviewById(id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Soft delete interview
 */
const deleteInterview = async (id, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Soft delete interview
    const [interview] = await trx('interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      .returning('*')
    
    if (!interview) {
      throw new Error('Interview not found')
    }
    
    // Soft delete all detail_interviews
    await trx('detail_interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
    
    await trx.commit()
    
    return interview
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

module.exports = {
  getCandidates,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview
}

