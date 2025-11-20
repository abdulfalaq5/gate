const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get interviews with pagination and filtering menggunakan sistem filter standar
 * Include relasi: schedule_interview, candidate, detail_interviews
 */
const getInterviews = async (queryParams) => {
  const logPrefix = '[getInterviews]'
  
  console.log(`${logPrefix} ========== FUNCTION STARTED ==========`)
  console.log(`${logPrefix} Input queryParams:`, JSON.stringify(queryParams, null, 2))
  console.log(`${logPrefix} queryParams type:`, typeof queryParams)
  console.log(`${logPrefix} queryParams is null:`, queryParams === null)
  console.log(`${logPrefix} queryParams is undefined:`, queryParams === undefined)
  
  try {
    // Validasi queryParams
    if (!queryParams || typeof queryParams !== 'object') {
      console.error(`${logPrefix} ❌ Invalid queryParams:`, queryParams)
      console.error(`${logPrefix} queryParams type:`, typeof queryParams)
      queryParams = { pagination: { page: 1, limit: 10 } }
      console.log(`${logPrefix} ✅ Using default queryParams:`, JSON.stringify(queryParams))
    }
    
    console.log(`${logPrefix} ✅ queryParams validated`)
    console.log(`${logPrefix} queryParams.pagination:`, queryParams?.pagination)
    console.log(`${logPrefix} queryParams.sorting:`, queryParams?.sorting)
    console.log(`${logPrefix} queryParams.search:`, queryParams?.search)
    console.log(`${logPrefix} queryParams.filters:`, queryParams?.filters)
    console.log(`${logPrefix} queryParams.dateRange:`, queryParams?.dateRange)
    
  // Base query untuk interviews
    console.log(`${logPrefix} Building base query...`)
    let baseQuery
    try {
      baseQuery = pgCore('interviews')
    .select('interviews.*')
    .where('interviews.is_delete', false)
      console.log(`${logPrefix} ✅ Base query created`)
    } catch (error) {
      console.error(`${logPrefix} ❌ Error creating base query:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
  
  // Apply semua filter standar
    console.log(`${logPrefix} Applying standard filters...`)
    let dataQuery
    try {
      console.log(`${logPrefix} Calling applyStandardFilters with:`, {
        baseQueryType: typeof baseQuery,
        queryParamsType: typeof queryParams,
        queryParamsKeys: Object.keys(queryParams || {})
      })
      dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
      console.log(`${logPrefix} ✅ Data query built successfully`)
      console.log(`${logPrefix} dataQuery type:`, typeof dataQuery)
      console.log(`${logPrefix} dataQuery is Promise:`, dataQuery instanceof Promise)
    } catch (error) {
      console.error(`${logPrefix} ❌ Error building dataQuery:`, error)
      console.error(`${logPrefix} Error name:`, error?.name)
      console.error(`${logPrefix} Error message:`, error?.message)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
  
  // Build count query untuk pagination metadata
    console.log(`${logPrefix} Building count query...`)
    let countQuery
    try {
      console.log(`${logPrefix} Calling buildCountQuery with:`, {
        baseQueryType: typeof baseQuery,
        queryParamsType: typeof queryParams
      })
      countQuery = buildCountQuery(baseQuery, queryParams)
      console.log(`${logPrefix} ✅ Count query built successfully`)
      console.log(`${logPrefix} countQuery type:`, typeof countQuery)
      console.log(`${logPrefix} countQuery is Promise:`, countQuery instanceof Promise)
    } catch (error) {
      console.error(`${logPrefix} ❌ Error building countQuery:`, error)
      console.error(`${logPrefix} Error name:`, error?.name)
      console.error(`${logPrefix} Error message:`, error?.message)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
  
  // Execute queries secara parallel
    console.log(`${logPrefix} ========== EXECUTING QUERIES ==========`)
  let interviews, countResult
  try {
      console.log(`${logPrefix} Preparing Promise.all for data and count queries`)
      console.log(`${logPrefix} dataQuery type before Promise.resolve:`, typeof dataQuery)
      console.log(`${logPrefix} countQuery type before Promise.resolve:`, typeof countQuery)
      
      // Wrap queries in Promise to ensure proper error handling
      console.log(`${logPrefix} Wrapping dataQuery in Promise.resolve...`)
      const dataQueryPromise = Promise.resolve(dataQuery).then(
        (result) => {
          console.log(`${logPrefix} ✅ dataQuery Promise resolved`)
          console.log(`${logPrefix} dataQuery result type:`, typeof result)
          console.log(`${logPrefix} dataQuery result isArray:`, Array.isArray(result))
          console.log(`${logPrefix} dataQuery result is null:`, result === null)
          console.log(`${logPrefix} dataQuery result is undefined:`, result === undefined)
          
          // Ensure result is an array
          if (Array.isArray(result)) {
            console.log(`${logPrefix} ✅ dataQuery returned array with length:`, result.length)
            return result
          }
          if (result === undefined || result === null) {
            console.warn(`${logPrefix} ⚠️ dataQuery returned undefined/null, defaulting to empty array`)
            return []
          }
          console.warn(`${logPrefix} ⚠️ dataQuery returned non-array, converting to array:`, typeof result, result)
          return []
        },
        (err) => {
          console.error(`${logPrefix} ❌ Error in dataQuery execution:`, err)
          console.error(`${logPrefix} Error name:`, err?.name)
          console.error(`${logPrefix} Error message:`, err?.message)
          console.error(`${logPrefix} DataQuery error stack:`, err?.stack)
        return []
        }
      )
      
      console.log(`${logPrefix} Wrapping countQuery.first() in Promise.resolve...`)
      let countQueryFirst
      try {
        countQueryFirst = countQuery.first()
        console.log(`${logPrefix} ✅ countQuery.first() called, type:`, typeof countQueryFirst)
        console.log(`${logPrefix} countQuery.first() is Promise:`, countQueryFirst instanceof Promise)
      } catch (error) {
        console.error(`${logPrefix} ❌ Error calling countQuery.first():`, error)
        console.error(`${logPrefix} Error stack:`, error.stack)
        throw error
      }
      
      const countQueryPromise = Promise.resolve(countQueryFirst).then(
        (result) => {
          console.log(`${logPrefix} ✅ countQuery Promise resolved`)
          console.log(`${logPrefix} countQuery result type:`, typeof result)
          console.log(`${logPrefix} countQuery result:`, result)
          console.log(`${logPrefix} countQuery result is null:`, result === null)
          console.log(`${logPrefix} countQuery result is undefined:`, result === undefined)
          
          // Ensure result has total property
          if (result && typeof result === 'object' && result.total !== undefined) {
            console.log(`${logPrefix} ✅ countQuery returned valid result with total:`, result.total)
            return result
          }
          console.warn(`${logPrefix} ⚠️ countQuery returned invalid result, defaulting to {total: 0}:`, result)
          return { total: 0 }
        },
        (err) => {
          console.error(`${logPrefix} ❌ Error in countQuery execution:`, err)
          console.error(`${logPrefix} Error name:`, err?.name)
          console.error(`${logPrefix} Error message:`, err?.message)
          console.error(`${logPrefix} CountQuery error stack:`, err?.stack)
        return { total: 0 }
        }
      )
      
      // Ensure both are promises
      console.log(`${logPrefix} Validating promises...`)
      if (!(dataQueryPromise instanceof Promise)) {
        console.error(`${logPrefix} ❌ dataQueryPromise is not a Promise:`, typeof dataQueryPromise, dataQueryPromise)
        throw new Error('dataQuery is not a Promise')
      }
      console.log(`${logPrefix} ✅ dataQueryPromise is a Promise`)
      
      if (!(countQueryPromise instanceof Promise)) {
        console.error(`${logPrefix} ❌ countQueryPromise is not a Promise:`, typeof countQueryPromise, countQueryPromise)
        throw new Error('countQuery.first() is not a Promise')
      }
      console.log(`${logPrefix} ✅ countQueryPromise is a Promise`)
      
      console.log(`${logPrefix} Awaiting Promise.all...`)
      const results = await Promise.all([dataQueryPromise, countQueryPromise])
      
      console.log(`${logPrefix} ✅ Promise.all completed`)
      console.log(`${logPrefix} Results type:`, typeof results)
      console.log(`${logPrefix} Results isArray:`, Array.isArray(results))
      console.log(`${logPrefix} Results length:`, results?.length)
      console.log(`${logPrefix} Results full:`, JSON.stringify(results, null, 2))
      
      // Detailed logging for each result
      if (Array.isArray(results)) {
        console.log(`${logPrefix} results[0] exists:`, results[0] !== undefined)
        console.log(`${logPrefix} results[0] type:`, typeof results[0])
        console.log(`${logPrefix} results[0] isArray:`, Array.isArray(results[0]))
        console.log(`${logPrefix} results[0] value:`, results[0])
        
        console.log(`${logPrefix} results[1] exists:`, results[1] !== undefined)
        console.log(`${logPrefix} results[1] type:`, typeof results[1])
        console.log(`${logPrefix} results[1] value:`, results[1])
      }
    
    // Ensure results is an array and has at least 2 elements
    if (!Array.isArray(results)) {
        console.error(`${logPrefix} ❌ Promise.all did not return an array:`, typeof results, results)
      throw new Error('Promise.all did not return an array')
    }
      console.log(`${logPrefix} ✅ Results is an array`)
    
    if (results.length < 2) {
        console.error(`${logPrefix} ❌ Invalid query results: expected 2 results, got ${results.length}`, results)
      throw new Error(`Invalid query results: expected 2 results, got ${results.length}`)
    }
      console.log(`${logPrefix} ✅ Results has ${results.length} elements`)
    
      // Safely extract results with additional validation
      console.log(`${logPrefix} Extracting results[0]...`)
      if (results[0] === undefined) {
        console.error(`${logPrefix} ❌ results[0] is undefined!`)
        console.error(`${logPrefix} Full results array:`, results)
        interviews = []
      } else {
        console.log(`${logPrefix} ✅ results[0] exists, type:`, typeof results[0])
    interviews = results[0]
      }
      
      console.log(`${logPrefix} Extracting results[1]...`)
      if (results[1] === undefined) {
        console.error(`${logPrefix} ❌ results[1] is undefined!`)
        console.error(`${logPrefix} Full results array:`, results)
        countResult = { total: 0 }
      } else {
        console.log(`${logPrefix} ✅ results[1] exists, type:`, typeof results[1])
        countResult = results[1]
      }
      
      console.log(`${logPrefix} ✅ Results extracted successfully`)
      console.log(`${logPrefix} interviews type:`, typeof interviews, 'isArray:', Array.isArray(interviews))
      console.log(`${logPrefix} interviews length:`, Array.isArray(interviews) ? interviews.length : 'N/A')
      console.log(`${logPrefix} countResult:`, countResult)
    
    // Validate interviews
    if (interviews === undefined || interviews === null) {
        console.warn(`${logPrefix} ⚠️ interviews is undefined or null, defaulting to empty array`)
      interviews = []
    }
      console.log(`${logPrefix} ✅ Interviews validated`)
  } catch (error) {
      console.error(`${logPrefix} ❌ Error executing queries:`, error)
      console.error(`${logPrefix} Error name:`, error?.name)
      console.error(`${logPrefix} Error message:`, error?.message)
      console.error(`${logPrefix} Error stack:`, error.stack)
    // Return empty result instead of throwing to prevent crash
    interviews = []
    countResult = { total: 0 }
  }
  
  // Ensure interviews is an array
  const interviewsArray = Array.isArray(interviews) ? interviews : []
    console.log(`${logPrefix} Interviews array length:`, interviewsArray.length)
  
  // Ensure countResult has total
    let total = 0
    if (countResult && typeof countResult === 'object') {
      if (countResult.total !== undefined && countResult.total !== null) {
        total = parseInt(countResult.total) || 0
      }
    }
    console.log(`${logPrefix} Total count:`, total)
  
  // Load relasi untuk setiap interview
    let interviewsWithRelations = []
    try {
      if (interviewsArray.length > 0) {
        console.log(`${logPrefix} Loading relations for ${interviewsArray.length} interviews`)
        
        interviewsWithRelations = await Promise.all(
    interviewsArray
            .filter(interview => {
              const isValid = interview && interview.interview_id
              if (!isValid) {
                console.warn(`${logPrefix} Filtering out invalid interview:`, interview)
              }
              return isValid
            })
            .map(async (interview, index) => {
              try {
                console.log(`${logPrefix} Loading relations for interview ${index + 1}/${interviewsArray.length}, ID: ${interview.interview_id}`)
                
        // Get detail_interviews relation
                let detailInterviews = []
                try {
                  detailInterviews = await pgCore('detail_interviews')
          .select('detail_interviews.*')
          .where('detail_interviews.interview_id', interview.interview_id)
          .where('detail_interviews.is_delete', false)
          .orderBy('detail_interviews.created_at', 'asc')
                  
                  if (!Array.isArray(detailInterviews)) {
                    console.warn(`${logPrefix} detailInterviews is not an array for interview ${interview.interview_id}`)
                    detailInterviews = []
                  }
                } catch (error) {
                  console.error(`${logPrefix} Error loading detail_interviews for interview ${interview.interview_id}:`, error)
                  detailInterviews = []
                }
      
      interview.detail_interviews = detailInterviews
      
      // Get schedule_interview relation if exists
      if (interview.schedule_interview_id) {
                  try {
        const scheduleInterview = await pgCore('schedule_interviews')
          .select('schedule_interviews.*')
          .where('schedule_interviews.schedule_interview_id', interview.schedule_interview_id)
          .where('schedule_interviews.is_delete', false)
          .first()
        
        if (scheduleInterview) {
          interview.schedule_interview = scheduleInterview
          
          // Get candidate relation if exists
          if (scheduleInterview.candidate_id) {
                        try {
            const candidate = await pgCore('candidates')
              .select('candidates.*')
              .where('candidates.candidate_id', scheduleInterview.candidate_id)
              .where('candidates.is_delete', false)
              .first()
            
            if (candidate) {
              interview.schedule_interview.candidate = candidate
              
              // Get company relation if exists
              if (candidate.company_id) {
                              try {
                const company = await pgCore('companies')
                  .select('company_id', 'company_name', 'company_address', 'company_email')
                  .where('company_id', candidate.company_id)
                  .where('is_delete', false)
                  .first()
                
                if (company) {
                  interview.schedule_interview.candidate.company = company
                                }
                              } catch (error) {
                                console.error(`${logPrefix} Error loading company for candidate ${candidate.candidate_id}:`, error)
                }
              }
              
              // Get department relation if exists
              if (candidate.department_id) {
                              try {
                const department = await pgCore('departments')
                  .select('department_id', 'department_name', 'department_parent_id', 'company_id')
                  .where('department_id', candidate.department_id)
                  .where('is_delete', false)
                  .first()
                
                if (department) {
                  interview.schedule_interview.candidate.department = department
                                }
                              } catch (error) {
                                console.error(`${logPrefix} Error loading department for candidate ${candidate.candidate_id}:`, error)
                }
              }
              
              // Get title relation if exists
              if (candidate.title_id) {
                              try {
                const title = await pgCore('titles')
                  .select('title_id', 'title_name')
                  .where('title_id', candidate.title_id)
                  .where('is_delete', false)
                  .first()
                
                if (title) {
                  interview.schedule_interview.candidate.title = title
                }
                              } catch (error) {
                                console.error(`${logPrefix} Error loading title for candidate ${candidate.candidate_id}:`, error)
                              }
                            }
                          }
                        } catch (error) {
                          console.error(`${logPrefix} Error loading candidate for schedule_interview ${scheduleInterview.schedule_interview_id}:`, error)
                        }
                      }
                    }
                  } catch (error) {
                    console.error(`${logPrefix} Error loading schedule_interview for interview ${interview.interview_id}:`, error)
        }
      }
      
      return interview
              } catch (error) {
                console.error(`${logPrefix} Error processing interview ${interview?.interview_id}:`, error)
                console.error(`${logPrefix} Error stack:`, error?.stack)
                return interview // Return interview even if relations fail
              }
            })
        )
        
        console.log(`${logPrefix} Relations loaded successfully for ${interviewsWithRelations.length} interviews`)
      } else {
        console.log(`${logPrefix} No interviews to load relations for`)
      }
    } catch (error) {
      console.error(`${logPrefix} Error loading relations:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      // Use interviews without relations if relation loading fails
      interviewsWithRelations = interviewsArray
    }
    
    // Ensure interviewsWithRelations is an array
    if (!Array.isArray(interviewsWithRelations)) {
      console.warn(`${logPrefix} interviewsWithRelations is not an array, defaulting to empty array`)
      interviewsWithRelations = []
    }
  
    // Ensure pagination exists
    console.log(`${logPrefix} ========== FORMATTING RESPONSE ==========`)
    let pagination = { page: 1, limit: 10 }
    if (queryParams && queryParams.pagination && typeof queryParams.pagination === 'object') {
      pagination = {
        page: queryParams.pagination.page || 1,
        limit: queryParams.pagination.limit || 10
      }
    }
    
    console.log(`${logPrefix} Pagination:`, JSON.stringify(pagination, null, 2))
    console.log(`${logPrefix} Total:`, total)
    console.log(`${logPrefix} interviewsWithRelations type:`, typeof interviewsWithRelations)
    console.log(`${logPrefix} interviewsWithRelations isArray:`, Array.isArray(interviewsWithRelations))
    console.log(`${logPrefix} interviewsWithRelations length:`, Array.isArray(interviewsWithRelations) ? interviewsWithRelations.length : 'N/A')
  
  // Format response dengan pagination metadata
    try {
      console.log(`${logPrefix} Calling formatSimplePaginatedResponse...`)
      console.log(`${logPrefix} Arguments:`, {
        dataType: typeof (interviewsWithRelations || []),
        dataIsArray: Array.isArray(interviewsWithRelations || []),
        dataLength: Array.isArray(interviewsWithRelations || []) ? (interviewsWithRelations || []).length : 'N/A',
        paginationType: typeof pagination,
        pagination: pagination,
        totalType: typeof total,
        total: total
      })
      
      const result = formatSimplePaginatedResponse(interviewsWithRelations || [], pagination, total)
      
      console.log(`${logPrefix} ✅ Response formatted successfully`)
      console.log(`${logPrefix} Result type:`, typeof result)
      console.log(`${logPrefix} Result:`, JSON.stringify(result, null, 2))
      console.log(`${logPrefix} ========== FUNCTION COMPLETED SUCCESSFULLY ==========`)
      return result
    } catch (error) {
      console.error(`${logPrefix} ❌ Error formatting response:`, error)
      console.error(`${logPrefix} Error name:`, error?.name)
      console.error(`${logPrefix} Error message:`, error?.message)
      console.error(`${logPrefix} Error stack:`, error.stack)
      // Return basic response if formatting fails
      const fallbackResult = {
        data: interviewsWithRelations || [],
        pagination: {
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          total: total || 0,
          totalPages: Math.ceil((total || 0) / (pagination.limit || 10)) || 0
        }
      }
      console.log(`${logPrefix} Returning fallback result:`, JSON.stringify(fallbackResult, null, 2))
      return fallbackResult
    }
  } catch (error) {
    console.error(`${logPrefix} ❌ Fatal error in getInterviews:`, error)
    console.error(`${logPrefix} Error name:`, error?.name)
    console.error(`${logPrefix} Error message:`, error?.message)
    console.error(`${logPrefix} Fatal error stack:`, error.stack)
    // Return empty result to prevent crash
    const errorResult = {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }
    console.log(`${logPrefix} Returning error result:`, JSON.stringify(errorResult, null, 2))
    return errorResult
  }
}

/**
 * Get candidates for interview (untuk endpoint /get) - DEPRECATED
 * @deprecated Use getInterviews instead
 */
const getCandidates = async (queryParams) => {
  const logPrefix = '[getCandidates]'
  
  try {
    // Validasi queryParams
    if (!queryParams || typeof queryParams !== 'object') {
      console.error(`${logPrefix} Invalid queryParams:`, queryParams)
      queryParams = { pagination: { page: 1, limit: 10 } }
    }
    
    console.log(`${logPrefix} Starting query with params:`, JSON.stringify(queryParams))
    
  // Base query untuk candidates
  const baseQuery = pgCore('candidates')
    .select('candidates.*')
    .where('candidates.is_delete', false)
  
  // Apply semua filter standar
    let dataQuery, countQuery
    try {
      dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
      countQuery = buildCountQuery(baseQuery, queryParams)
      console.log(`${logPrefix} Queries built successfully`)
    } catch (error) {
      console.error(`${logPrefix} Error building queries:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
  
  // Execute queries secara parallel
    let candidates, countResult
    try {
      console.log(`${logPrefix} Executing Promise.all for data and count queries`)
      
      // Wrap queries in Promise to ensure proper error handling
      const dataQueryPromise = Promise.resolve(dataQuery).then(
        (result) => {
          // Ensure result is an array
          if (Array.isArray(result)) {
            return result
          }
          if (result === undefined || result === null) {
            console.warn(`${logPrefix} dataQuery returned undefined/null, defaulting to empty array`)
            return []
          }
          console.warn(`${logPrefix} dataQuery returned non-array, converting to array:`, typeof result)
          return []
        },
        (err) => {
          console.error(`${logPrefix} Error in dataQuery execution:`, err)
          console.error(`${logPrefix} DataQuery error stack:`, err?.stack)
          return []
        }
      )
      
      const countQueryPromise = Promise.resolve(countQuery.first()).then(
        (result) => {
          // Ensure result has total property
          if (result && typeof result === 'object' && result.total !== undefined) {
            return result
          }
          console.warn(`${logPrefix} countQuery returned invalid result, defaulting to {total: 0}:`, result)
          return { total: 0 }
        },
        (err) => {
          console.error(`${logPrefix} Error in countQuery execution:`, err)
          console.error(`${logPrefix} CountQuery error stack:`, err?.stack)
          return { total: 0 }
        }
      )
      
      const results = await Promise.all([dataQueryPromise, countQueryPromise])
      
      console.log(`${logPrefix} Promise.all completed, results length:`, results?.length)
      console.log(`${logPrefix} Results type check:`, {
        isArray: Array.isArray(results),
        length: results?.length,
        firstType: typeof results?.[0],
        secondType: typeof results?.[1]
      })
      
      if (!Array.isArray(results)) {
        console.error(`${logPrefix} Promise.all did not return an array:`, typeof results, results)
        candidates = []
        countResult = { total: 0 }
      } else if (results.length < 2) {
        console.error(`${logPrefix} Invalid query results: expected 2 results, got ${results.length}`, results)
        candidates = []
        countResult = { total: 0 }
      } else {
        // Safely extract results with additional validation
        if (results[0] === undefined) {
          console.error(`${logPrefix} results[0] is undefined!`)
          candidates = []
        } else {
          candidates = results[0]
        }
        
        if (results[1] === undefined) {
          console.error(`${logPrefix} results[1] is undefined!`)
          countResult = { total: 0 }
        } else {
          countResult = results[1]
        }
      }
    } catch (error) {
      console.error(`${logPrefix} Error executing queries:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      console.error(`${logPrefix} Error name:`, error?.name)
      console.error(`${logPrefix} Error message:`, error?.message)
      candidates = []
      countResult = { total: 0 }
    }
    
    // Ensure candidates is an array
    const candidatesArray = Array.isArray(candidates) ? candidates : []
  
  // Ensure countResult has total
  const total = countResult && countResult.total ? parseInt(countResult.total) : 0
    
    // Ensure pagination exists
    const pagination = queryParams && queryParams.pagination ? queryParams.pagination : { page: 1, limit: 10 }
  
  // Format response dengan pagination metadata
    return formatSimplePaginatedResponse(candidatesArray, pagination, total)
  } catch (error) {
    console.error(`${logPrefix} Fatal error:`, error)
    console.error(`${logPrefix} Fatal error stack:`, error.stack)
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }
  }
}

/**
 * Get interview by ID with all relations (detail_interviews)
 */
const getInterviewById = async (id) => {
  const logPrefix = '[getInterviewById]'
  
  try {
    // Validasi id
    if (!id) {
      console.error(`${logPrefix} Invalid id parameter:`, id)
      return null
    }
    
    console.log(`${logPrefix} Getting interview with ID:`, id)
    
    let interview
    try {
      interview = await pgCore('interviews')
    .select('interviews.*')
    .where('interviews.interview_id', id)
    .where('interviews.is_delete', false)
    .first()
    } catch (error) {
      console.error(`${logPrefix} Error querying interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      return null
    }
  
    if (!interview || !interview.interview_id) {
      console.log(`${logPrefix} Interview not found for ID:`, id)
    return null
  }
    
    console.log(`${logPrefix} Interview found, loading relations`)
  
  // Get detail_interviews relation
    let detailInterviews = []
    try {
      detailInterviews = await pgCore('detail_interviews')
    .select('detail_interviews.*')
    .where('detail_interviews.interview_id', interview.interview_id)
    .where('detail_interviews.is_delete', false)
    .orderBy('detail_interviews.created_at', 'asc')
      
      if (!Array.isArray(detailInterviews)) {
        console.warn(`${logPrefix} detailInterviews is not an array`)
        detailInterviews = []
      }
    } catch (error) {
      console.error(`${logPrefix} Error loading detail_interviews:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      detailInterviews = []
    }
  
  interview.detail_interviews = detailInterviews
  
  // Get schedule_interview relation if exists
  if (interview.schedule_interview_id) {
      try {
    const scheduleInterview = await pgCore('schedule_interviews')
      .select('schedule_interviews.*')
      .where('schedule_interviews.schedule_interview_id', interview.schedule_interview_id)
      .where('schedule_interviews.is_delete', false)
      .first()
    
    if (scheduleInterview) {
      interview.schedule_interview = scheduleInterview
      
      // Get candidate relation if exists
      if (scheduleInterview.candidate_id) {
            try {
        const candidate = await pgCore('candidates')
          .select('candidates.*')
          .where('candidates.candidate_id', scheduleInterview.candidate_id)
          .where('candidates.is_delete', false)
          .first()
        
        if (candidate) {
          interview.schedule_interview.candidate = candidate
        }
            } catch (error) {
              console.error(`${logPrefix} Error loading candidate:`, error)
            }
          }
        }
      } catch (error) {
        console.error(`${logPrefix} Error loading schedule_interview:`, error)
        console.error(`${logPrefix} Error stack:`, error.stack)
      }
    }
    
    console.log(`${logPrefix} Interview loaded successfully`)
    return interview
  } catch (error) {
    console.error(`${logPrefix} Fatal error:`, error)
    console.error(`${logPrefix} Fatal error stack:`, error.stack)
    return null
  }
}

/**
 * Create new interview with detail_interviews
 */
const createInterview = async (interviewData, detailInterviewsData = [], userId) => {
  const logPrefix = '[createInterview]'
  
  // Validasi input
  if (!interviewData || typeof interviewData !== 'object') {
    console.error(`${logPrefix} Invalid interviewData:`, interviewData)
    throw new Error('Invalid interview data')
  }
  
  if (!userId) {
    console.error(`${logPrefix} Invalid userId:`, userId)
    throw new Error('User ID is required')
  }
  
  if (!Array.isArray(detailInterviewsData)) {
    console.warn(`${logPrefix} detailInterviewsData is not an array, defaulting to empty array`)
    detailInterviewsData = []
  }
  
  console.log(`${logPrefix} Creating interview with userId:`, userId)
  
  const trx = await pgCore.transaction()
  
  try {
    // Insert interview
    let interview
    try {
      const insertResult = await trx('interviews')
      .insert({
        ...interviewData,
        employee_id: userId, // Set employee_id from token
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*')
      
      if (!Array.isArray(insertResult)) {
        console.error(`${logPrefix} insertResult is not an array:`, typeof insertResult, insertResult)
        throw new Error('Failed to insert interview: invalid result type')
      }
      
      if (insertResult.length === 0) {
        console.error(`${logPrefix} insertResult is empty array`)
        throw new Error('Failed to insert interview: no result returned')
      }
      
      if (insertResult[0] === undefined || insertResult[0] === null) {
        console.error(`${logPrefix} insertResult[0] is undefined or null`)
        throw new Error('Failed to insert interview: result[0] is undefined')
      }
      
      interview = insertResult[0]
      
      if (!interview || !interview.interview_id) {
        console.error(`${logPrefix} interview is invalid:`, interview)
        throw new Error('Failed to insert interview: invalid result')
      }
      
      console.log(`${logPrefix} Interview inserted successfully with ID:`, interview.interview_id)
    } catch (error) {
      console.error(`${logPrefix} Error inserting interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
    
    // Insert detail_interviews if provided
    if (detailInterviewsData && detailInterviewsData.length > 0) {
      try {
        const detailInterviewsToInsert = detailInterviewsData
          .filter(detail => detail && typeof detail === 'object') // Filter invalid details
          .map(detail => ({
        interview_id: interview.interview_id,
            detail_interview_aspect: detail.aspect || null,
            detail_interview_question: detail.question || null,
            detail_interview_answer: detail.answer || null,
        detail_interview_score: detail.score ? String(detail.score) : null,
        detail_interview_description: detail.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        is_delete: false
      }))
      
        if (detailInterviewsToInsert.length > 0) {
      await trx('detail_interviews').insert(detailInterviewsToInsert)
          console.log(`${logPrefix} Inserted ${detailInterviewsToInsert.length} detail_interviews`)
        }
      } catch (error) {
        console.error(`${logPrefix} Error inserting detail_interviews:`, error)
        console.error(`${logPrefix} Error stack:`, error.stack)
        throw error
      }
    }
    
    await trx.commit()
    console.log(`${logPrefix} Transaction committed successfully`)
    
    // Get full interview with relations
    try {
      const fullInterview = await getInterviewById(interview.interview_id)
      if (!fullInterview) {
        console.warn(`${logPrefix} Could not retrieve full interview after creation`)
        return interview // Return basic interview if getInterviewById fails
      }
      return fullInterview
    } catch (error) {
      console.error(`${logPrefix} Error retrieving full interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      return interview // Return basic interview if getInterviewById fails
    }
  } catch (error) {
    console.error(`${logPrefix} Fatal error, rolling back transaction:`, error)
    console.error(`${logPrefix} Error stack:`, error.stack)
    await trx.rollback()
    throw error
  }
}

/**
 * Update interview with detail_interviews
 */
const updateInterview = async (id, interviewData, detailInterviewsData = [], userId) => {
  const logPrefix = '[updateInterview]'
  
  // Validasi input
  if (!id) {
    console.error(`${logPrefix} Invalid id:`, id)
    throw new Error('Interview ID is required')
  }
  
  if (!interviewData || typeof interviewData !== 'object') {
    console.error(`${logPrefix} Invalid interviewData:`, interviewData)
    throw new Error('Invalid interview data')
  }
  
  if (!userId) {
    console.error(`${logPrefix} Invalid userId:`, userId)
    throw new Error('User ID is required')
  }
  
  if (!Array.isArray(detailInterviewsData)) {
    console.warn(`${logPrefix} detailInterviewsData is not an array, defaulting to empty array`)
    detailInterviewsData = []
  }
  
  console.log(`${logPrefix} Updating interview with ID:`, id, 'userId:', userId)
  
  const trx = await pgCore.transaction()
  
  try {
    // Update interview
    let interview
    try {
      const updateResult = await trx('interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        ...interviewData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
      if (!Array.isArray(updateResult)) {
        console.error(`${logPrefix} updateResult is not an array:`, typeof updateResult, updateResult)
        throw new Error('Failed to update interview: invalid result type')
      }
      
      if (updateResult.length === 0) {
        console.error(`${logPrefix} updateResult is empty array`)
        throw new Error('Interview not found')
      }
      
      if (updateResult[0] === undefined || updateResult[0] === null) {
        console.error(`${logPrefix} updateResult[0] is undefined or null`)
        throw new Error('Failed to update interview: result[0] is undefined')
      }
      
      interview = updateResult[0]
      
      if (!interview || !interview.interview_id) {
        console.error(`${logPrefix} interview is invalid:`, interview)
      throw new Error('Interview not found')
      }
      
      console.log(`${logPrefix} Interview updated successfully`)
    } catch (error) {
      console.error(`${logPrefix} Error updating interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
    
    // Soft delete existing detail_interviews
    try {
    await trx('detail_interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      console.log(`${logPrefix} Existing detail_interviews soft deleted`)
    } catch (error) {
      console.error(`${logPrefix} Error soft deleting detail_interviews:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
    
    // Insert new detail_interviews if provided
    if (detailInterviewsData && detailInterviewsData.length > 0) {
      try {
        const detailInterviewsToInsert = detailInterviewsData
          .filter(detail => detail && typeof detail === 'object') // Filter invalid details
          .map(detail => ({
        interview_id: id,
            detail_interview_aspect: detail.aspect || null,
            detail_interview_question: detail.question || null,
            detail_interview_answer: detail.answer || null,
        detail_interview_score: detail.score ? String(detail.score) : null,
        detail_interview_description: detail.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        is_delete: false
      }))
      
        if (detailInterviewsToInsert.length > 0) {
      await trx('detail_interviews').insert(detailInterviewsToInsert)
          console.log(`${logPrefix} Inserted ${detailInterviewsToInsert.length} new detail_interviews`)
        }
      } catch (error) {
        console.error(`${logPrefix} Error inserting detail_interviews:`, error)
        console.error(`${logPrefix} Error stack:`, error.stack)
        throw error
      }
    }
    
    await trx.commit()
    console.log(`${logPrefix} Transaction committed successfully`)
    
    // Get full interview with relations
    try {
      const fullInterview = await getInterviewById(id)
      if (!fullInterview) {
        console.warn(`${logPrefix} Could not retrieve full interview after update`)
        return interview // Return basic interview if getInterviewById fails
      }
      return fullInterview
    } catch (error) {
      console.error(`${logPrefix} Error retrieving full interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      return interview // Return basic interview if getInterviewById fails
    }
  } catch (error) {
    console.error(`${logPrefix} Fatal error, rolling back transaction:`, error)
    console.error(`${logPrefix} Error stack:`, error.stack)
    await trx.rollback()
    throw error
  }
}

/**
 * Soft delete interview
 */
const deleteInterview = async (id, userId) => {
  const logPrefix = '[deleteInterview]'
  
  // Validasi input
  if (!id) {
    console.error(`${logPrefix} Invalid id:`, id)
    throw new Error('Interview ID is required')
  }
  
  if (!userId) {
    console.error(`${logPrefix} Invalid userId:`, userId)
    throw new Error('User ID is required')
  }
  
  console.log(`${logPrefix} Soft deleting interview with ID:`, id, 'userId:', userId)
  
  const trx = await pgCore.transaction()
  
  try {
    // Soft delete interview
    let interview
    try {
      const deleteResult = await trx('interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      .returning('*')
    
      if (!Array.isArray(deleteResult)) {
        console.error(`${logPrefix} deleteResult is not an array:`, typeof deleteResult, deleteResult)
        throw new Error('Failed to delete interview: invalid result type')
      }
      
      if (deleteResult.length === 0) {
        console.error(`${logPrefix} deleteResult is empty array`)
        throw new Error('Interview not found')
      }
      
      if (deleteResult[0] === undefined || deleteResult[0] === null) {
        console.error(`${logPrefix} deleteResult[0] is undefined or null`)
        throw new Error('Failed to delete interview: result[0] is undefined')
      }
      
      interview = deleteResult[0]
      
      if (!interview || !interview.interview_id) {
        console.error(`${logPrefix} interview is invalid:`, interview)
      throw new Error('Interview not found')
      }
      
      console.log(`${logPrefix} Interview soft deleted successfully`)
    } catch (error) {
      console.error(`${logPrefix} Error soft deleting interview:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      throw error
    }
    
    // Soft delete all detail_interviews
    try {
    await trx('detail_interviews')
      .where('interview_id', id)
      .where('is_delete', false)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      console.log(`${logPrefix} Detail interviews soft deleted successfully`)
    } catch (error) {
      console.error(`${logPrefix} Error soft deleting detail_interviews:`, error)
      console.error(`${logPrefix} Error stack:`, error.stack)
      // Don't throw here, interview is already deleted
    }
    
    await trx.commit()
    console.log(`${logPrefix} Transaction committed successfully`)
    
    return interview
  } catch (error) {
    console.error(`${logPrefix} Fatal error, rolling back transaction:`, error)
    console.error(`${logPrefix} Error stack:`, error.stack)
    await trx.rollback()
    throw error
  }
}

module.exports = {
  getInterviews,
  getCandidates,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview
}

