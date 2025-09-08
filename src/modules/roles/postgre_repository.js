const { rolesColumns } = require('./column');
const { CorePostgres } = require('../../../repository/postgres/core_postgres');

class RolesRepository extends CorePostgres {
  constructor() {
    super('roles', rolesColumns);
  }

  async findById(roleId) {
    return await this.findOne({ role_id: roleId, is_delete: false });
  }

  async findAllActive() {
    return await this.findMany({ is_delete: false });
  }

  async findChildren(parentId) {
    return await this.findMany({ role_parent_id: parentId, is_delete: false });
  }

  async findRootRoles() {
    return await this.findMany({ role_parent_id: null, is_delete: false });
  }

  async createRole(data) {
    return await this.create(data);
  }

  async updateRole(roleId, data) {
    return await this.update({ role_id: roleId }, data);
  }

  async deleteRole(roleId, deletedBy) {
    return await this.update(
      { role_id: roleId },
      { 
        is_delete: true, 
        deleted_at: new Date(), 
        deleted_by: deletedBy 
      }
    );
  }

  async restoreRole(roleId, updatedBy) {
    return await this.update(
      { role_id: roleId },
      { 
        is_delete: false, 
        deleted_at: null, 
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      }
    );
  }

  async getRolePermissions(roleId) {
    const query = `
      SELECT 
        p.permission_id,
        p.permission_name,
        m.menu_id,
        m.menu_name,
        m.menu_url
      FROM roleHasMenuPermissions rhmp
      JOIN permissions p ON rhmp.permission_id = p.permission_id
      JOIN menus m ON rhmp.menu_id = m.menu_id
      WHERE rhmp.role_id = ? 
        AND p.is_delete = false 
        AND m.is_delete = false
    `;
    
    return await this.db.raw(query, [roleId]);
  }

  async assignPermissions(roleId, permissions) {
    // Delete existing permissions
    await this.db('roleHasMenuPermissions').where('role_id', roleId).del();
    
    // Insert new permissions
    if (permissions && permissions.length > 0) {
      const permissionData = permissions.map(perm => ({
        role_id: roleId,
        menu_id: perm.menu_id,
        permission_id: perm.permission_id,
        created_at: new Date(),
        created_by: perm.created_by
      }));
      
      await this.db('roleHasMenuPermissions').insert(permissionData);
    }
  }
}

module.exports = RolesRepository;
