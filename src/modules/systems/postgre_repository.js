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