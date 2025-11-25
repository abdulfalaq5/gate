/**
 * Query Builder Utility untuk membantu repository menggunakan filter standar
 */

/**
 * Apply pagination ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} pagination - Pagination parameters dari parsePagination
 * @returns {Object} Query builder dengan pagination
 */
const applyPagination = (queryBuilder, pagination) => {
  if (!pagination) {
    console.warn('applyPagination: pagination is undefined, using defaults')
    return queryBuilder.limit(10).offset(0)
  }
  const limit = pagination.limit || 10
  const offset = pagination.offset || 0
  return queryBuilder
    .limit(limit)
    .offset(offset)
}

/**
 * Apply sorting ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} sorting - Sorting parameters dari parseSorting
 * @returns {Object} Query builder dengan sorting
 */
const applySorting = (queryBuilder, sorting) => {
  if (!sorting) {
    console.warn('applySorting: sorting is undefined, using defaults')
    return queryBuilder.orderBy('created_at', 'desc')
  }
  const sortBy = sorting.sortBy || 'created_at'
  const sortOrder = sorting.sortOrder || 'desc'
  return queryBuilder.orderBy(sortBy, sortOrder)
}

/**
 * Apply search ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} search - Search parameters dari parseSearch
 * @returns {Object} Query builder dengan search
 */
const applySearch = (queryBuilder, search) => {
  if (!search) {
    return queryBuilder
  }
  
  const { searchTerm, searchableColumns } = search || {}
  
  if (!searchTerm || !searchableColumns || !Array.isArray(searchableColumns) || searchableColumns.length === 0) {
    return queryBuilder
  }
  
  return queryBuilder.where(function() {
    searchableColumns.forEach((column, index) => {
      if (index === 0) {
        this.where(column, 'ilike', `%${searchTerm}%`)
      } else {
        this.orWhere(column, 'ilike', `%${searchTerm}%`)
      }
    })
  })
}

/**
 * Apply filters ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} filters - Filter parameters dari parseFilters
 * @returns {Object} Query builder dengan filters
 */
const applyFilters = (queryBuilder, filters) => {
  if (!filters || typeof filters !== 'object') {
    return queryBuilder
  }
  
  Object.keys(filters).forEach(key => {
    if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
      return // Skip empty filters
    }
    
    // Handle ambiguous columns by checking if the query has joins
    try {
      const queryString = queryBuilder.toString().toLowerCase()
      if (queryString.includes('join')) {
        // For joined tables, specify the table name to avoid ambiguity
        if (key === 'department_id' || key === 'created_by' || key === 'updated_by') {
          queryBuilder.where(`titles.${key}`, filters[key])
        } else if (key === 'company_id') {
          // For departments table with companies join, use departments.company_id
          queryBuilder.where(`departments.${key}`, filters[key])
        } else {
          queryBuilder.where(key, filters[key])
        }
      } else {
        queryBuilder.where(key, filters[key])
      }
    } catch (error) {
      console.warn(`Error applying filter for ${key}:`, error)
      // Continue with other filters
    }
  })
  
  return queryBuilder
}

/**
 * Apply date range ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} dateRange - Date range parameters dari parseDateRange
 * @returns {Object} Query builder dengan date range
 */
const applyDateRange = (queryBuilder, dateRange) => {
  if (!dateRange) {
    return queryBuilder
  }
  
  const { startDate, endDate, dateColumn } = dateRange || {}
  
  if (startDate && dateColumn) {
    queryBuilder.where(dateColumn, '>=', startDate)
  }
  
  if (endDate && dateColumn) {
    queryBuilder.where(dateColumn, '<=', endDate)
  }
  
  return queryBuilder
}

/**
 * Apply semua filter standar ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
 * @returns {Object} Query builder dengan semua filter
 */
const applyStandardFilters = (queryBuilder, queryParams) => {
  if (!queryParams) {
    console.warn('applyStandardFilters: queryParams is undefined, using defaults')
    queryParams = {
      pagination: { page: 1, limit: 10, offset: 0 },
      sorting: { sortBy: 'created_at', sortOrder: 'desc' },
      search: { searchTerm: '', searchableColumns: [] },
      filters: {},
      dateRange: { startDate: null, endDate: null, dateColumn: 'created_at' }
    }
  }
  
  const { pagination, sorting, search, filters, dateRange } = queryParams
  
  // Apply search first
  queryBuilder = applySearch(queryBuilder, search)
  
  // Apply filters
  queryBuilder = applyFilters(queryBuilder, filters || {})
  
  // Apply date range
  queryBuilder = applyDateRange(queryBuilder, dateRange || {})
  
  // Apply sorting
  queryBuilder = applySorting(queryBuilder, sorting)
  
  // Apply pagination last
  queryBuilder = applyPagination(queryBuilder, pagination)
  
  return queryBuilder
}

/**
 * Build count query untuk pagination metadata
 * @param {Object} baseQuery - Base query builder tanpa pagination
 * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
 * @returns {Object} Count query builder
 */
const buildCountQuery = (baseQuery, queryParams) => {
  if (!queryParams) {
    console.warn('buildCountQuery: queryParams is undefined, using defaults')
    queryParams = {
      search: { searchTerm: '', searchableColumns: [] },
      filters: {},
      dateRange: { startDate: null, endDate: null, dateColumn: 'created_at' }
    }
  }
  
  const { search, filters, dateRange } = queryParams
  
  // Clone base query dan hapus select untuk count
  let countQuery = baseQuery.clone().clearSelect()
  
  // Apply search
  countQuery = applySearch(countQuery, search)
  
  // Apply filters
  countQuery = applyFilters(countQuery, filters || {})
  
  // Apply date range
  countQuery = applyDateRange(countQuery, dateRange)
  
  return countQuery.count('* as total')
}

/**
 * Format response dengan pagination metadata
 * @param {Array} data - Data hasil query
 * @param {Object} pagination - Pagination parameters
 * @param {Number} total - Total records
 * @returns {Object} Formatted response dengan pagination metadata
 */
const formatPaginatedResponse = (data, pagination, total) => {
  const totalPages = Math.ceil(total / pagination.limit);
  
  return {
    data,
    pagination: {
      current_page: pagination.page,
      per_page: pagination.limit,
      total: parseInt(total),
      total_pages: totalPages,
      has_next_page: pagination.page < totalPages,
      has_prev_page: pagination.page > 1,
    }
  };
};

/**
 * Format response dengan pagination metadata versi sederhana
 * @param {Array} data - Data hasil query
 * @param {Object} pagination - Pagination parameters
 * @param {Number} total - Total records
 * @returns {Object} Formatted response dengan pagination metadata sederhana
 */
const formatSimplePaginatedResponse = (data, pagination, total) => {
  // Safe defaults
  const safeData = Array.isArray(data) ? data : []
  const safePagination = pagination || { page: 1, limit: 10 }
  const safeTotal = parseInt(total) || 0
  const safeLimit = parseInt(safePagination.limit) || 10
  
  const totalPages = safeLimit > 0 ? Math.ceil(safeTotal / safeLimit) : 0

  return {
    data: safeData,
    pagination: {
      page: parseInt(safePagination.page) || 1,
      limit: safeLimit,
      total: safeTotal,
      totalPages,
    },
  };
};

module.exports = {
  applyPagination,
  applySorting,
  applySearch,
  applyFilters,
  applyDateRange,
  applyStandardFilters,
  buildCountQuery,
  formatPaginatedResponse,
  formatSimplePaginatedResponse,
};
