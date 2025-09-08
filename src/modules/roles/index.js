const RolesHandler = require('./handler');
const {
  createRoleValidation,
  updateRoleValidation,
  deleteRoleValidation,
  getRoleValidation,
  listRolesValidation,
  assignPermissionsValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const rolesHandler = new RolesHandler();

module.exports = {
  createRole: [createRoleValidation, validationMiddleware, rolesHandler.createRole.bind(rolesHandler)],
  getRole: [getRoleValidation, validationMiddleware, rolesHandler.getRole.bind(rolesHandler)],
  listRoles: [listRolesValidation, validationMiddleware, rolesHandler.listRoles.bind(rolesHandler)],
  getRolePermissions: [getRoleValidation, validationMiddleware, rolesHandler.getRolePermissions.bind(rolesHandler)],
  assignPermissions: [assignPermissionsValidation, validationMiddleware, rolesHandler.assignPermissions.bind(rolesHandler)],
  updateRole: [updateRoleValidation, validationMiddleware, rolesHandler.updateRole.bind(rolesHandler)],
  deleteRole: [deleteRoleValidation, validationMiddleware, rolesHandler.deleteRole.bind(rolesHandler)],
  restoreRole: [deleteRoleValidation, validationMiddleware, rolesHandler.restoreRole.bind(rolesHandler)],
};
