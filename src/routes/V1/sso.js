const express = require('express');
const router = express.Router();

// Import modules
const permissionsRoutes = require('../../modules/permissions');
const menusRoutes = require('../../modules/menus');
const systemsRoutes = require('../../modules/systems');
const rolesRoutes = require('../../modules/roles');
const usersRoutes = require('../../modules/users');
const ssoRoutes = require('../../modules/sso');
const systemHasMenusRoutes = require('../../modules/system_has_menus');
const menuHasPermissionsRoutes = require('../../modules/menu_has_permissions');
const roleHasMenuPermissionsRoutes = require('../../modules/role_has_menu_permissions');

// SSO Routes
router.post('/auth/sso/login', ssoRoutes.login);
router.get('/auth/sso/authorize', ssoRoutes.authorize);
router.post('/auth/sso/token', ssoRoutes.token);
router.get('/auth/sso/userinfo', ssoRoutes.userInfo);
router.post('/auth/sso/logout', ssoRoutes.logout);
router.get('/auth/sso/stats', ssoRoutes.getStats);

// Client Registration Routes
router.post('/auth/sso/clients', ssoRoutes.registerClient);
router.get('/auth/sso/clients', ssoRoutes.listClients);
router.get('/auth/sso/clients/:client_id', ssoRoutes.getClient);
router.put('/auth/sso/clients/:client_id', ssoRoutes.updateClient);
router.delete('/auth/sso/clients/:client_id', ssoRoutes.deleteClient);

// Session Management Routes
router.get('/auth/sso/sessions/:session_id', ssoRoutes.getSessionInfo);
router.get('/auth/sso/sessions/user/:user_id', ssoRoutes.getUserSessions);
router.get('/auth/sso/sessions/stats', ssoRoutes.getSessionStats);
router.post('/auth/sso/sessions/:session_id/end', ssoRoutes.endSession);

// Scope Management Routes
router.get('/auth/sso/scopes', ssoRoutes.getScopes);
router.get('/auth/sso/scopes/:scope', ssoRoutes.getScopeInfo);
router.post('/auth/sso/scopes/validate', ssoRoutes.validateScopes);
router.post('/auth/sso/scopes/check-permission', ssoRoutes.checkPermission);

// User Management Routes
// Permissions
router.post('/permissions', permissionsRoutes.createPermission);
router.get('/permissions', permissionsRoutes.listPermissions);
router.get('/permissions/:id', permissionsRoutes.getPermission);
router.put('/permissions/:id', permissionsRoutes.updatePermission);
router.delete('/permissions/:id', permissionsRoutes.deletePermission);

// Menus
router.post('/menus', menusRoutes.createMenu);
router.get('/menus', menusRoutes.listMenus);
router.get('/menus/tree', menusRoutes.getMenuTree);
router.get('/menus/:id', menusRoutes.getMenu);
router.put('/menus/:id', menusRoutes.updateMenu);
router.delete('/menus/:id', menusRoutes.deleteMenu);

// Systems
router.post('/systems', systemsRoutes.createSystem);
router.get('/systems', systemsRoutes.listSystems);
router.get('/systems/:id', systemsRoutes.getSystem);
router.put('/systems/:id', systemsRoutes.updateSystem);
router.delete('/systems/:id', systemsRoutes.deleteSystem);

// Roles
router.post('/roles', rolesRoutes.createRole);
router.get('/roles', rolesRoutes.listRoles);
router.get('/roles/:id', rolesRoutes.getRole);
router.get('/roles/:id/permissions', rolesRoutes.getRolePermissions);
router.post('/roles/:id/permissions', rolesRoutes.assignPermissions);
router.put('/roles/:id', rolesRoutes.updateRole);
router.delete('/roles/:id', rolesRoutes.deleteRole);

// Users
router.post('/users', usersRoutes.createUser);
router.get('/users', usersRoutes.listUsers);
router.get('/users/:id', usersRoutes.getUser);
router.get('/users/:id/permissions', usersRoutes.getUserPermissions);
router.post('/users/login', usersRoutes.login);
router.put('/users/:id', usersRoutes.updateUser);
router.delete('/users/:id', usersRoutes.deleteUser);
router.post('/users/change-password', usersRoutes.changePassword);

// System Has Menus
router.post('/system-has-menus', systemHasMenusRoutes.createSystemHasMenu);
router.get('/system-has-menus', systemHasMenusRoutes.listSystemHasMenus);
router.get('/system-has-menus/:system_id/:menu_id', systemHasMenusRoutes.getSystemHasMenu);
router.get('/system-has-menus/system/:system_id', systemHasMenusRoutes.getMenusBySystem);
router.get('/system-has-menus/menu/:menu_id', systemHasMenusRoutes.getSystemsByMenu);
router.put('/system-has-menus/:system_id/:menu_id', systemHasMenusRoutes.updateSystemHasMenu);
router.delete('/system-has-menus/:system_id/:menu_id', systemHasMenusRoutes.deleteSystemHasMenu);
router.delete('/system-has-menus/system/:system_id', systemHasMenusRoutes.deleteBySystem);
router.delete('/system-has-menus/menu/:menu_id', systemHasMenusRoutes.deleteByMenu);

// Menu Has Permissions
router.post('/menu-has-permissions', menuHasPermissionsRoutes.createMenuHasPermission);
router.get('/menu-has-permissions', menuHasPermissionsRoutes.listMenuHasPermissions);
router.get('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.getMenuHasPermission);
router.get('/menu-has-permissions/menu/:menu_id', menuHasPermissionsRoutes.getPermissionsByMenu);
router.get('/menu-has-permissions/permission/:permission_id', menuHasPermissionsRoutes.getMenusByPermission);
router.put('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.updateMenuHasPermission);
router.delete('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.deleteMenuHasPermission);
router.delete('/menu-has-permissions/menu/:menu_id', menuHasPermissionsRoutes.deleteByMenu);
router.delete('/menu-has-permissions/permission/:permission_id', menuHasPermissionsRoutes.deleteByPermission);

// Role Has Menu Permissions
router.post('/role-has-menu-permissions', roleHasMenuPermissionsRoutes.createRoleHasMenuPermission);
router.get('/role-has-menu-permissions', roleHasMenuPermissionsRoutes.listRoleHasMenuPermissions);
router.get('/role-has-menu-permissions/:role_id/:menu_id/:permission_id', roleHasMenuPermissionsRoutes.getRoleHasMenuPermission);
router.get('/role-has-menu-permissions/role/:role_id', roleHasMenuPermissionsRoutes.getPermissionsByRole);
router.get('/role-has-menu-permissions/menu/:menu_id', roleHasMenuPermissionsRoutes.getRolesByMenu);
router.get('/role-has-menu-permissions/permission/:permission_id', roleHasMenuPermissionsRoutes.getRolesByPermission);
router.get('/role-has-menu-permissions/role/:role_id/menu/:menu_id', roleHasMenuPermissionsRoutes.getPermissionsByRoleAndMenu);
router.put('/role-has-menu-permissions/:role_id/:menu_id/:permission_id', roleHasMenuPermissionsRoutes.updateRoleHasMenuPermission);
router.delete('/role-has-menu-permissions/:role_id/:menu_id/:permission_id', roleHasMenuPermissionsRoutes.deleteRoleHasMenuPermission);
router.delete('/role-has-menu-permissions/role/:role_id', roleHasMenuPermissionsRoutes.deleteByRole);
router.delete('/role-has-menu-permissions/menu/:menu_id', roleHasMenuPermissionsRoutes.deleteByMenu);
router.delete('/role-has-menu-permissions/permission/:permission_id', roleHasMenuPermissionsRoutes.deleteByPermission);
router.delete('/role-has-menu-permissions/role/:role_id/menu/:menu_id', roleHasMenuPermissionsRoutes.deleteByRoleAndMenu);

module.exports = router;
