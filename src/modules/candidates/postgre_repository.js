const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get candidates with pagination and filtering menggunakan sistem filter standar
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
 * Get candidate by ID with all relations
 */
const getCandidateById = async (id) => {
  const candidate = await pgCore('candidates')
    .select('candidates.*')
    .where('candidates.candidate_id', id)
    .where('candidates.is_delete', false)
    .first()
  
  if (!candidate) {
    return null
  }
  
  // Get company relation if exists
  if (candidate.company_id) {
    const company = await pgCore('companies')
      .select('company_id', 'company_name', 'company_address', 'company_email')
      .where('company_id', candidate.company_id)
      .where('is_delete', false)
      .first()
    
    if (company) {
      candidate.company = company
    }
  }
  
  // Get department relation if exists
  if (candidate.department_id) {
    const department = await pgCore('departments')
      .select('department_id', 'department_name', 'department_code')
      .where('department_id', candidate.department_id)
      .where('is_delete', false)
      .first()
    
    if (department) {
      candidate.department = department
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
      candidate.title = title
    }
  }
  
  return candidate
}

/**
 * Create new candidate
 */
const createCandidate = async (candidateData) => {
  const [candidate] = await pgCore('candidates')
    .insert({
      ...candidateData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return candidate
}

/**
 * Update candidate
 */
const updateCandidate = async (id, candidateData) => {
  const [candidate] = await pgCore('candidates')
    .where('candidate_id', id)
    .update({
      ...candidateData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return candidate
}

/**
 * Soft delete candidate
 */
const deleteCandidate = async (id, deletedBy) => {
  const [candidate] = await pgCore('candidates')
    .where('candidate_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return candidate
}

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
}

