const MenuHasPermissionsHandler = require('./handler');

module.exports = {
  createMenuHasPermission: MenuHasPermissionsHandler.createMenuHasPermission.bind(MenuHasPermissionsHandler),
  getMenuHasPermission: MenuHasPermissionsHandler.getMenuHasPermission.bind(MenuHasPermissionsHandler),
  listMenuHasPermissions: MenuHasPermissionsHandler.listMenuHasPermissions.bind(MenuHasPermissionsHandler),
  getPermissionsByMenu: MenuHasPermissionsHandler.getPermissionsByMenu.bind(MenuHasPermissionsHandler),
  getMenusByPermission: MenuHasPermissionsHandler.getMenusByPermission.bind(MenuHasPermissionsHandler),
  updateMenuHasPermission: MenuHasPermissionsHandler.updateMenuHasPermission.bind(MenuHasPermissionsHandler),
  deleteMenuHasPermission: MenuHasPermissionsHandler.deleteMenuHasPermission.bind(MenuHasPermissionsHandler),
  deleteByMenu: MenuHasPermissionsHandler.deleteByMenu.bind(MenuHasPermissionsHandler),
  deleteByPermission: MenuHasPermissionsHandler.deleteByPermission.bind(MenuHasPermissionsHandler),
};
