const { permissionsColumns } = require('./column');
const { CorePostgres } = require('../../../repository/postgres/core_postgres');

class PermissionsRepository extends CorePostgres {
  constructor() {
    super('permissions', permissionsColumns);
  }

  async findById(permissionId) {
    return await this.findOne({ permission_id: permissionId, is_delete: false });
  }

  async findAllActive() {
    return await this.findMany({ is_delete: false });
  }

  async createPermission(data) {
    return await this.create(data);
  }

  async updatePermission(permissionId, data) {
    return await this.update({ permission_id: permissionId }, data);
  }

  async deletePermission(permissionId, deletedBy) {
    return await this.update(
      { permission_id: permissionId },
      { 
        is_delete: true, 
        deleted_at: new Date(), 
        deleted_by: deletedBy 
      }
    );
  }

  async restorePermission(permissionId, updatedBy) {
    return await this.update(
      { permission_id: permissionId },
      { 
        is_delete: false, 
        deleted_at: null, 
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      }
    );
  }
}

module.exports = PermissionsRepository;
