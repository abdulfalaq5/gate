const express = require('express');
const router = express.Router();

// Import modules
const permissionsRoutes = require('../../modules/permissions');
const menusRoutes = require('../../modules/menus');
const systemsRoutes = require('../../modules/systems');
const rolesRoutes = require('../../modules/roles');
const usersRoutes = require('../../modules/users');
const ssoRoutes = require('../../modules/sso');

// SSO Routes
router.post('/auth/sso/login', ssoRoutes.login);
router.get('/auth/sso/authorize', ssoRoutes.authorize);
router.post('/auth/sso/token', ssoRoutes.token);
router.get('/auth/sso/userinfo', ssoRoutes.userInfo);
router.get('/auth/sso/callback', ssoRoutes.callback);
router.post('/auth/sso/logout', ssoRoutes.logout);

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

module.exports = router;
