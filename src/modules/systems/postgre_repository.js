const { systemsColumns } = require('./column');

/**
 * Systems Repository - Database operations for systems table
 */
class SystemsRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'systems'
  }

  async findById(systemId) {
    const [system] = await this.knex(this.tableName)
      .select('*')
      .where('system_id', systemId)
      .where('is_delete', false)
    
    return system
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  async findAllActiveWithPagination(page = 1, limit = 10, search = '') {
    let query = this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
    
    // Add search filter if provided
    if (search && search.trim() !== '') {
      query = query.where(function() {
        this.where('system_name', 'ilike', `%${search}%`)
          .orWhere('system_url', 'ilike', `%${search}%`)
          .orWhere('system_icon', 'ilike', `%${search}%`)
      })
    }
    
    // Add pagination
    const offset = (page - 1) * limit
    const systems = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)
    
    // Get total count for pagination info
    let countQuery = this.knex(this.tableName)
      .count('* as total')
      .where('is_delete', false)
    
    if (search && search.trim() !== '') {
      countQuery = countQuery.where(function() {
        this.where('system_name', 'ilike', `%${search}%`)
          .orWhere('system_url', 'ilike', `%${search}%`)
          .orWhere('system_icon', 'ilike', `%${search}%`)
      })
    }
    
    const [{ total }] = await countQuery
    
    return {
      data: systems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async createSystem(data) {
    const [system] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return system
  }

  async updateSystem(systemId, data) {
    const [system] = await this.knex(this.tableName)
      .where('system_id', systemId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return system
  }

  async deleteSystem(systemId, deletedBy) {
    const [system] = await this.knex(this.tableName)
      .where('system_id', systemId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return system
  }
}

module.exports = SystemsRepository;