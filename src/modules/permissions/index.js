const PermissionsHandler = require('./handler');

module.exports = {
  createPermission: PermissionsHandler.createPermission.bind(PermissionsHandler),
  getPermission: PermissionsHandler.getPermission.bind(PermissionsHandler),
  listPermissions: PermissionsHandler.listPermissions.bind(PermissionsHandler),
  updatePermission: PermissionsHandler.updatePermission.bind(PermissionsHandler),
  deletePermission: PermissionsHandler.deletePermission.bind(PermissionsHandler),
  restorePermission: PermissionsHandler.restorePermission.bind(PermissionsHandler),
};