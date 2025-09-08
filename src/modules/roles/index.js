const RolesHandler = require('./handler');

module.exports = {
  createRole: RolesHandler.createRole.bind(RolesHandler),
  getRole: RolesHandler.getRole.bind(RolesHandler),
  listRoles: RolesHandler.listRoles.bind(RolesHandler),
  getRolePermissions: RolesHandler.getRolePermissions.bind(RolesHandler),
  assignPermissions: RolesHandler.assignPermissions.bind(RolesHandler),
  updateRole: RolesHandler.updateRole.bind(RolesHandler),
  deleteRole: RolesHandler.deleteRole.bind(RolesHandler),
};