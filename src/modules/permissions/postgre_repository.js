const { permissionsColumns } = require('./column');

/**
 * Permissions Repository - Database operations for permissions table
 */
class PermissionsRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'permissions'
  }

  async findById(permissionId) {
    const [permission] = await this.knex(this.tableName)
      .select('*')
      .where('permission_id', permissionId)
      .where('is_delete', false)
    
    return permission
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  async createPermission(data) {
    const [permission] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return permission
  }

  async updatePermission(permissionId, data) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return permission
  }

  async deletePermission(permissionId, deletedBy) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return permission
  }

  async restorePermission(permissionId, updatedBy) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        is_delete: false,
        deleted_at: null,
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      })
      .returning('*')
    
    return permission
  }
}

module.exports = PermissionsRepository;