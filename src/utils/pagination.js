/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { LIMIT, PAGE } = require('./constant');

/**
 * Standard filter utility untuk semua module
 * Mendukung pagination, sorting, searching, dan filtering
 */

/**
 * Parse query parameters untuk pagination
 * @param {Object} req - Express request object
 * @param {Array} defaultOrder - Default order [column, direction]
 * @returns {Object} Pagination parameters
 */
const parsePagination = (req, defaultOrder = ['created_at', 'desc']) => {
  const page = Math.max(1, parseInt(req.query.page) || PAGE);
  const limit = Math.max(1, parseInt(req.query.limit) || LIMIT);
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset,
  };
};

/**
 * Parse query parameters untuk sorting
 * @param {Object} req - Express request object
 * @param {Array} allowedColumns - Array kolom yang diizinkan untuk sorting
 * @param {Array} defaultOrder - Default order [column, direction]
 * @returns {Object} Sorting parameters
 */
const parseSorting = (req, allowedColumns = [], defaultOrder = ['created_at', 'desc']) => {
  // Ensure defaultOrder is a valid array
  const safeDefaultOrder = Array.isArray(defaultOrder) && defaultOrder.length >= 2
    ? defaultOrder
    : ['created_at', 'desc'];
  
  const sortBy = req.query.sort_by || safeDefaultOrder[0];
  const sortOrder = req.query.sort_order || safeDefaultOrder[1];
  
  // Validasi kolom yang diizinkan
  const validColumn = allowedColumns.length > 0 && allowedColumns.includes(sortBy) 
    ? sortBy 
    : safeDefaultOrder[0];
  
  // Validasi order direction
  const validOrder = sortOrder && typeof sortOrder === 'string' && ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
    ? sortOrder.toLowerCase() 
    : safeDefaultOrder[1];
  
  return {
    sortBy: validColumn,
    sortOrder: validOrder,
  };
};

/**
 * Parse query parameters untuk searching
 * @param {Object} req - Express request object
 * @param {Array} searchableColumns - Array kolom yang bisa di-search
 * @returns {Object} Search parameters
 */
const parseSearch = (req, searchableColumns = []) => {
  const searchTerm = req.query.search || req.query.q || '';
  
  return {
    searchTerm: searchTerm.trim(),
    searchableColumns,
  };
};

/**
 * Parse query parameters untuk filtering
 * @param {Object} req - Express request object
 * @param {Array} allowedFilters - Array kolom yang diizinkan untuk filter
 * @returns {Object} Filter parameters
 */
const parseFilters = (req, allowedFilters = []) => {
  const filters = {};
  
  if (allowedFilters.length === 0) {
    return filters;
  }
  
  Object.keys(req.query).forEach(key => {
    if (allowedFilters.includes(key) && req.query[key] !== undefined && req.query[key] !== '') {
      filters[key] = req.query[key];
    }
  });
  
  return filters;
};

/**
 * Parse query parameters untuk date range filtering
 * @param {Object} req - Express request object
 * @param {String} dateColumn - Nama kolom tanggal (default: 'created_at')
 * @returns {Object} Date range parameters
 */
const parseDateRange = (req, dateColumn = 'created_at') => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  
  return {
    startDate,
    endDate,
    dateColumn,
  };
};

/**
 * Main function untuk parse semua query parameters standar
 * @param {Object} req - Express request object
 * @param {Object} options - Konfigurasi options
 * @returns {Object} Parsed parameters
 */
const parseStandardQuery = (req, options = {}) => {
  const logPrefix = '[parseStandardQuery]'
  
  try {
    console.log(`${logPrefix} ========== FUNCTION STARTED ==========`)
    console.log(`${logPrefix} req type:`, typeof req)
    console.log(`${logPrefix} req.query:`, JSON.stringify(req?.query, null, 2))
    console.log(`${logPrefix} options:`, JSON.stringify(options, null, 2))
    
    const {
      allowedSortColumns = [],
      defaultSort = ['created_at', 'desc'],
      searchableColumns = [],
      allowedFilters = [],
      dateColumn = 'created_at',
    } = options;
    
    console.log(`${logPrefix} Calling parsePagination...`)
    const pagination = parsePagination(req, defaultSort);
    console.log(`${logPrefix} ✅ Pagination parsed:`, JSON.stringify(pagination, null, 2))
    
    console.log(`${logPrefix} Calling parseSorting...`)
    const sorting = parseSorting(req, allowedSortColumns, defaultSort);
    console.log(`${logPrefix} ✅ Sorting parsed:`, JSON.stringify(sorting, null, 2))
    
    console.log(`${logPrefix} Calling parseSearch...`)
    const search = parseSearch(req, searchableColumns);
    console.log(`${logPrefix} ✅ Search parsed:`, JSON.stringify(search, null, 2))
    
    console.log(`${logPrefix} Calling parseFilters...`)
    const filters = parseFilters(req, allowedFilters);
    console.log(`${logPrefix} ✅ Filters parsed:`, JSON.stringify(filters, null, 2))
    
    console.log(`${logPrefix} Calling parseDateRange...`)
    const dateRange = parseDateRange(req, dateColumn);
    console.log(`${logPrefix} ✅ DateRange parsed:`, JSON.stringify(dateRange, null, 2))
    
    const result = {
      pagination,
      sorting,
      search,
      filters,
      dateRange,
    };
    
    console.log(`${logPrefix} ✅ All parsing completed`)
    console.log(`${logPrefix} Returning result:`, JSON.stringify(result, null, 2))
    return result;
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in parseStandardQuery:`, error)
    console.error(`${logPrefix} Error name:`, error?.name)
    console.error(`${logPrefix} Error message:`, error?.message)
    console.error(`${logPrefix} Error stack:`, error.stack)
    throw error
  }
};

/**
 * Build WHERE clause untuk search
 * @param {Object} searchParams - Search parameters dari parseSearch
 * @returns {Object} Knex where clause
 */
const buildSearchWhere = (searchParams) => {
  const { searchTerm, searchableColumns } = searchParams;
  
  if (!searchTerm || searchableColumns.length === 0) {
    return {};
  }
  
  return {
    method: 'where',
    args: [
      function() {
        searchableColumns.forEach((column, index) => {
          if (index === 0) {
            this.where(column, 'ilike', `%${searchTerm}%`);
          } else {
            this.orWhere(column, 'ilike', `%${searchTerm}%`);
          }
        });
      }
    ]
  };
};

/**
 * Build WHERE clause untuk filters
 * @param {Object} filters - Filter parameters dari parseFilters
 * @returns {Object} Knex where clause
 */
const buildFiltersWhere = (filters) => {
  const whereClause = {};
  
  Object.keys(filters).forEach(key => {
    whereClause[key] = filters[key];
  });
  
  return whereClause;
};

/**
 * Build WHERE clause untuk date range
 * @param {Object} dateRange - Date range parameters dari parseDateRange
 * @returns {Object} Knex where clause
 */
const buildDateRangeWhere = (dateRange) => {
  const { startDate, endDate, dateColumn } = dateRange;
  const whereClause = {};
  
  if (startDate) {
    whereClause[dateColumn] = whereClause[dateColumn] || {};
    whereClause[dateColumn] = { ...whereClause[dateColumn], '>=': startDate };
  }
  
  if (endDate) {
    whereClause[dateColumn] = whereClause[dateColumn] || {};
    whereClause[dateColumn] = { ...whereClause[dateColumn], '<=': endDate };
  }
  
  return whereClause;
};

/**
 * Legacy functions untuk backward compatibility
 */
const dynamicFilter = (req, column = []) => {
  const push = {};
  const asArray = Object.entries(req.query);
  const filtered = asArray.filter(([key]) => column.includes(key));
  const newObject = Object.fromEntries(filtered);

  for (const prop in newObject) {
    if (prop) {
      push[prop] = newObject[prop];
    }
  }
  return push;
};

const paging = (req, defaultOrder = []) => {
  const direction = req?.query?.direction || defaultOrder[0];
  const order = req?.query?.order || defaultOrder[1];
  const page = +req?.query?.page || PAGE;
  const limit = +req?.query?.limit || LIMIT;
  const search = req?.query?.search;

  return {
    order,
    direction,
    page,
    limit,
    search,
  };
};

const dynamicFilterJoin = (req, column = []) => {
  try {
    const request = Object.entries(req.query);
    const data = {};

    for (const [i, v] of request) {
      const check = column.find((item) => item.split('.').pop() === i);

      if (check && v !== '') {
        data[check] = v;
      }
    }
    return data;
  } catch (error) {
    console.info('error dynamic filter', error);
    return {};
  }
};

const dynamicOrder = (filter = {}) => {
  let order;
  if (
    typeof filter.direction === 'string'
    && typeof filter.order === 'string'
  ) {
    order = [{ column: filter.direction, order: filter.order }];
  } else {
    const dir = filter.direction;
    const or = filter.order;
    const content = [];
    for (const a in dir) {
      content.push({ column: dir[a], order: or[a] });
    }
    order = content;
  }

  return order;
};

module.exports = {
  // New standard functions
  parseStandardQuery,
  parsePagination,
  parseSorting,
  parseSearch,
  parseFilters,
  parseDateRange,
  buildSearchWhere,
  buildFiltersWhere,
  buildDateRangeWhere,
  
  // Legacy functions for backward compatibility
  paging,
  dynamicFilter,
  dynamicFilterJoin,
  dynamicOrder,
};
