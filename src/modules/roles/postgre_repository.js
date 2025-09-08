const { rolesColumns } = require('./column');

/**
 * Roles Repository - Database operations for roles table
 */
class RolesRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'roles'
  }

  async findById(roleId) {
    const [role] = await this.knex(this.tableName)
      .select('*')
      .where('role_id', roleId)
      .where('is_delete', false)
    
    return role
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  async createRole(data) {
    const [role] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return role
  }

  async updateRole(roleId, data) {
    const [role] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return role
  }

  async deleteRole(roleId, deletedBy) {
    const [role] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return role
  }
}

module.exports = RolesRepository;