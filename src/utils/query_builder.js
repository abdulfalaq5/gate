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
  const logPrefix = '[applyPagination]'
  
  try {
    console.log(`${logPrefix} Input pagination:`, JSON.stringify(pagination, null, 2))
    
    if (!pagination) {
      console.error(`${logPrefix} ❌ pagination is null or undefined!`)
      throw new Error('pagination is required')
    }
    
    if (pagination.limit === undefined || pagination.limit === null) {
      console.error(`${logPrefix} ❌ pagination.limit is undefined or null!`)
      throw new Error('pagination.limit is required')
    }
    
    if (pagination.offset === undefined || pagination.offset === null) {
      console.error(`${logPrefix} ❌ pagination.offset is undefined or null!`)
      throw new Error('pagination.offset is required')
    }
    
    console.log(`${logPrefix} Applying limit:`, pagination.limit, 'offset:', pagination.offset)
    const result = queryBuilder
      .limit(pagination.limit)
      .offset(pagination.offset)
    
    console.log(`${logPrefix} ✅ Pagination applied successfully`)
    return result
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in applyPagination:`, error)
    console.error(`${logPrefix} Error stack:`, error.stack)
    throw error
  }
};

/**
 * Apply sorting ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} sorting - Sorting parameters dari parseSorting
 * @returns {Object} Query builder dengan sorting
 */
const applySorting = (queryBuilder, sorting) => {
  const logPrefix = '[applySorting]'
  
  try {
    console.log(`${logPrefix} Input sorting:`, JSON.stringify(sorting, null, 2))
    
    if (!sorting) {
      console.error(`${logPrefix} ❌ sorting is null or undefined!`)
      throw new Error('sorting is required')
    }
    
    if (!sorting.sortBy) {
      console.error(`${logPrefix} ❌ sorting.sortBy is missing!`)
      throw new Error('sorting.sortBy is required')
    }
    
    if (!sorting.sortOrder) {
      console.error(`${logPrefix} ❌ sorting.sortOrder is missing!`)
      throw new Error('sorting.sortOrder is required')
    }
    
    console.log(`${logPrefix} Applying orderBy:`, sorting.sortBy, sorting.sortOrder)
    const result = queryBuilder.orderBy(sorting.sortBy, sorting.sortOrder)
    
    console.log(`${logPrefix} ✅ Sorting applied successfully`)
    return result
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in applySorting:`, error)
    console.error(`${logPrefix} Error stack:`, error.stack)
    throw error
  }
};

/**
 * Apply search ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} search - Search parameters dari parseSearch
 * @returns {Object} Query builder dengan search
 */
const applySearch = (queryBuilder, search) => {
  const { searchTerm, searchableColumns } = search;
  
  if (!searchTerm || searchableColumns.length === 0) {
    return queryBuilder;
  }
  
  return queryBuilder.where(function() {
    searchableColumns.forEach((column, index) => {
      if (index === 0) {
        this.where(column, 'ilike', `%${searchTerm}%`);
      } else {
        this.orWhere(column, 'ilike', `%${searchTerm}%`);
      }
    });
  });
};

/**
 * Apply filters ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} filters - Filter parameters dari parseFilters
 * @returns {Object} Query builder dengan filters
 */
const applyFilters = (queryBuilder, filters) => {
  Object.keys(filters).forEach(key => {
    // Handle ambiguous columns by checking if the query has joins
    const queryString = queryBuilder.toString().toLowerCase();
    if (queryString.includes('join')) {
      // For joined tables, specify the table name to avoid ambiguity
      if (key === 'department_id' || key === 'created_by' || key === 'updated_by') {
        queryBuilder.where(`titles.${key}`, filters[key]);
      } else if (key === 'company_id') {
        // For departments table with companies join, use departments.company_id
        queryBuilder.where(`departments.${key}`, filters[key]);
      } else {
        queryBuilder.where(key, filters[key]);
      }
    } else {
      queryBuilder.where(key, filters[key]);
    }
  });
  
  return queryBuilder;
};

/**
 * Apply date range ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} dateRange - Date range parameters dari parseDateRange
 * @returns {Object} Query builder dengan date range
 */
const applyDateRange = (queryBuilder, dateRange) => {
  const { startDate, endDate, dateColumn } = dateRange;
  
  if (startDate) {
    queryBuilder.where(dateColumn, '>=', startDate);
  }
  
  if (endDate) {
    queryBuilder.where(dateColumn, '<=', endDate);
  }
  
  return queryBuilder;
};

/**
 * Apply semua filter standar ke query builder
 * @param {Object} queryBuilder - Knex query builder
 * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
 * @returns {Object} Query builder dengan semua filter
 */
const applyStandardFilters = (queryBuilder, queryParams) => {
  const logPrefix = '[applyStandardFilters]'
  
  try {
    console.log(`${logPrefix} ========== FUNCTION STARTED ==========`)
    console.log(`${logPrefix} queryBuilder type:`, typeof queryBuilder)
    console.log(`${logPrefix} queryParams type:`, typeof queryParams)
    console.log(`${logPrefix} queryParams:`, JSON.stringify(queryParams, null, 2))
    
    if (!queryParams) {
      console.error(`${logPrefix} ❌ queryParams is null or undefined!`)
      throw new Error('queryParams is required')
    }
    
    const { pagination, sorting, search, filters, dateRange } = queryParams;
    
    console.log(`${logPrefix} Extracted properties:`, {
      pagination: pagination ? 'exists' : 'missing',
      sorting: sorting ? 'exists' : 'missing',
      search: search ? 'exists' : 'missing',
      filters: filters ? 'exists' : 'missing',
      dateRange: dateRange ? 'exists' : 'missing'
    })
    
    // Apply search first
    console.log(`${logPrefix} Applying search...`)
    queryBuilder = applySearch(queryBuilder, search);
    console.log(`${logPrefix} ✅ Search applied`)
    
    // Apply filters
    console.log(`${logPrefix} Applying filters...`)
    queryBuilder = applyFilters(queryBuilder, filters);
    console.log(`${logPrefix} ✅ Filters applied`)
    
    // Apply date range
    console.log(`${logPrefix} Applying date range...`)
    queryBuilder = applyDateRange(queryBuilder, dateRange);
    console.log(`${logPrefix} ✅ Date range applied`)
    
    // Apply sorting
    console.log(`${logPrefix} Applying sorting...`)
    queryBuilder = applySorting(queryBuilder, sorting);
    console.log(`${logPrefix} ✅ Sorting applied`)
    
    // Apply pagination last
    console.log(`${logPrefix} Applying pagination...`)
    queryBuilder = applyPagination(queryBuilder, pagination);
    console.log(`${logPrefix} ✅ Pagination applied`)
    
    console.log(`${logPrefix} ✅ All filters applied successfully`)
    console.log(`${logPrefix} Returning queryBuilder, type:`, typeof queryBuilder)
    return queryBuilder;
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in applyStandardFilters:`, error)
    console.error(`${logPrefix} Error name:`, error?.name)
    console.error(`${logPrefix} Error message:`, error?.message)
    console.error(`${logPrefix} Error stack:`, error.stack)
    throw error
  }
};

/**
 * Build count query untuk pagination metadata
 * @param {Object} baseQuery - Base query builder tanpa pagination
 * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
 * @returns {Object} Count query builder
 */
const buildCountQuery = (baseQuery, queryParams) => {
  const logPrefix = '[buildCountQuery]'
  
  try {
    console.log(`${logPrefix} ========== FUNCTION STARTED ==========`)
    console.log(`${logPrefix} baseQuery type:`, typeof baseQuery)
    console.log(`${logPrefix} queryParams type:`, typeof queryParams)
    
    if (!queryParams) {
      console.error(`${logPrefix} ❌ queryParams is null or undefined!`)
      throw new Error('queryParams is required')
    }
    
    const { search, filters, dateRange } = queryParams;
    
    console.log(`${logPrefix} Extracted properties:`, {
      search: search ? 'exists' : 'missing',
      filters: filters ? 'exists' : 'missing',
      dateRange: dateRange ? 'exists' : 'missing'
    })
    
    // Clone base query dan hapus select untuk count
    console.log(`${logPrefix} Cloning base query...`)
    let countQuery = baseQuery.clone().clearSelect();
    console.log(`${logPrefix} ✅ Base query cloned`)
    
    // Apply search
    console.log(`${logPrefix} Applying search...`)
    countQuery = applySearch(countQuery, search);
    console.log(`${logPrefix} ✅ Search applied`)
    
    // Apply filters
    console.log(`${logPrefix} Applying filters...`)
    countQuery = applyFilters(countQuery, filters);
    console.log(`${logPrefix} ✅ Filters applied`)
    
    // Apply date range
    console.log(`${logPrefix} Applying date range...`)
    countQuery = applyDateRange(countQuery, dateRange);
    console.log(`${logPrefix} ✅ Date range applied`)
    
    console.log(`${logPrefix} Adding count...`)
    const result = countQuery.count('* as total');
    console.log(`${logPrefix} ✅ Count query built, type:`, typeof result)
    return result;
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in buildCountQuery:`, error)
    console.error(`${logPrefix} Error name:`, error?.name)
    console.error(`${logPrefix} Error message:`, error?.message)
    console.error(`${logPrefix} Error stack:`, error.stack)
    throw error
  }
};

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
  // Ensure pagination is valid
  if (!pagination || typeof pagination !== 'object') {
    throw new Error('Invalid pagination parameter')
  }
  
  // Ensure pagination.limit is valid and not zero
  const limit = pagination.limit && pagination.limit > 0 ? pagination.limit : 10
  const totalPages = Math.ceil(total / limit);

  return {
    data: Array.isArray(data) ? data : [],
    pagination: {
      page: pagination.page || 1,
      limit: limit,
      total: parseInt(total) || 0,
      totalPages: totalPages || 0,
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
