const { titlesColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Titles Repository - Database operations for titles table
 */
class TitlesRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'titles'
  }

  /**
   * Find titles dengan filter standar (pagination, sorting, searching, filtering)
   * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
   * @returns {Object} Paginated response dengan data dan metadata
   */
  async findWithFilters(queryParams) {
    // Base query untuk titles dengan JOIN ke departments
    const baseQuery = this.knex(this.tableName)
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .select(
        'titles.*',
        'departments.department_name'
      )
      .where('titles.is_delete', false);

    // Pisahkan filter relasi dari filter standar
    const { filters } = queryParams
    const relationFilters = {}
    const standardFilters = {}
    
    Object.keys(filters).forEach(key => {
      if (['department_name'].includes(key)) {
        relationFilters[key] = filters[key]
      } else {
        standardFilters[key] = filters[key]
      }
    })
    
    // Update queryParams untuk filter standar
    const modifiedQueryParams = {
      ...queryParams,
      filters: standardFilters
    }

    // Apply filter standar (tanpa relasi)
    let dataQuery = applyStandardFilters(baseQuery.clone(), modifiedQueryParams)
    
    // Apply filter relasi secara manual
    if (relationFilters.department_name) {
      dataQuery = dataQuery.where('departments.department_name', 'ilike', `%${relationFilters.department_name}%`)
    }

    // Build count query untuk pagination metadata dengan filter relasi yang sama
    let countBaseQuery = this.knex(this.tableName)
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .select('*')
      .where('titles.is_delete', false);
    
    let countQuery = buildCountQuery(countBaseQuery, modifiedQueryParams)
    
    // Apply filter relasi ke count query juga
    if (relationFilters.department_name) {
      countQuery = countQuery.where('departments.department_name', 'ilike', `%${relationFilters.department_name}%`)
    }

    // Execute queries secara parallel
    const [data, countResult] = await Promise.all([
      dataQuery,
      countQuery.first()
    ])

    // Format response dengan pagination metadata
    return formatPaginatedResponse(data, queryParams.pagination, countResult.total);
  }

  /**
   * Get titles with pagination and filtering (legacy method)
   */
  async getTitles({ page = 1, limit = 10, filters = {} }) {
    const offset = (page - 1) * limit
    
    let query = this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
    
    // Apply filters
    if (filters.search) {
      query = query.where(function() {
        this.where('title_name', 'ilike', `%${filters.search}%`)
      })
    }
    
    if (filters.department_id) {
      query = query.where('department_id', filters.department_id)
    }
    
    if (filters.is_delete !== undefined) {
      query = query.where('is_delete', filters.is_delete)
    }
    
    const [titles, totalCount] = await Promise.all([
      query.clone().offset(offset).limit(limit).orderBy('title_name'),
      query.clone().count('* as count').first()
    ])
    
    return {
      titles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        totalPages: Math.ceil(totalCount.count / limit)
      }
    }
  }

  /**
   * Get title by ID
   */
  async getTitleById(id) {
    const [title] = await this.knex(this.tableName)
      .select('*')
      .where('title_id', id)
      .where('is_delete', false)
    
    return title
  }

  /**
   * Create new title
   */
  async createTitle(titleData) {
    const [title] = await this.knex(this.tableName)
      .insert({
        ...titleData,
        created_at: new Date()
      })
      .returning('*')
    
    return title
  }

  /**
   * Update title
   */
  async updateTitle(id, titleData) {
    const [title] = await this.knex(this.tableName)
      .where('title_id', id)
      .update({
        ...titleData,
        updated_at: new Date()
      })
      .returning('*')
    
    return title
  }

  /**
   * Soft delete title
   */
  async deleteTitle(id, deletedBy) {
    const [title] = await this.knex(this.tableName)
      .where('title_id', id)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return title
  }

  /**
   * Get title by name
   */
  async getTitleByName(name) {
    const [title] = await this.knex(this.tableName)
      .select('*')
      .where('title_name', name)
      .where('is_delete', false)
    
    return title
  }

  /**
   * Get titles by department ID
   */
  async getTitlesByDepartmentId(departmentId) {
    return await this.knex(this.tableName)
      .select('*')
      .where('department_id', departmentId)
      .where('is_delete', false)
      .orderBy('title_name')
  }

  /**
   * Get titles statistics
   */
  async getTitlesStats() {
    const [stats] = await this.knex(this.tableName)
      .count('* as total')
      .where('is_delete', false)
    
    return {
      total: parseInt(stats.total)
    }
  }
}

module.exports = TitlesRepository