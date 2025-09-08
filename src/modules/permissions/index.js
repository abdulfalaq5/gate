const PermissionsHandler = require('./handler');
const {
  createPermissionValidation,
  updatePermissionValidation,
  deletePermissionValidation,
  getPermissionValidation,
  listPermissionsValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const permissionsHandler = new PermissionsHandler();

module.exports = {
  createPermission: [createPermissionValidation, validationMiddleware, permissionsHandler.createPermission.bind(permissionsHandler)],
  getPermission: [getPermissionValidation, validationMiddleware, permissionsHandler.getPermission.bind(permissionsHandler)],
  listPermissions: [listPermissionsValidation, validationMiddleware, permissionsHandler.listPermissions.bind(permissionsHandler)],
  updatePermission: [updatePermissionValidation, validationMiddleware, permissionsHandler.updatePermission.bind(permissionsHandler)],
  deletePermission: [deletePermissionValidation, validationMiddleware, permissionsHandler.deletePermission.bind(permissionsHandler)],
  restorePermission: [deletePermissionValidation, validationMiddleware, permissionsHandler.restorePermission.bind(permissionsHandler)],
};
