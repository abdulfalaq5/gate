const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import modules
const permissionsRoutes = require('../../modules/permissions');
const menusRoutes = require('../../modules/menus');
const systemsRoutes = require('../../modules/systems');
const ssoRoutes = require('../../modules/sso');
const systemHasMenusRoutes = require('../../modules/system_has_menus');
const menuHasPermissionsRoutes = require('../../modules/menu_has_permissions');
const companiesRoutes = require('../../modules/companies');
const departmentsRoutes = require('../../modules/departments');
const employeesRoutes = require('../../modules/employees');
const titlesRoutes = require('../../modules/titles');
const { updateProfileValidation } = require('../../modules/sso/profile_validation');
const { verifySSOToken } = require('../../middlewares');

// Configure multer for multipart/form-data
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 GB limit
    files: 10 // max 10 files
  }
});

// SSO Routes
router.post('/auth/sso/login', ssoRoutes.login);
router.get('/auth/sso/authorize', ssoRoutes.authorize);
router.post('/auth/sso/token', ssoRoutes.token);
router.get('/auth/sso/userinfo', ssoRoutes.userInfo);
router.get('/auth/sso/logout', verifySSOToken, ssoRoutes.logout);
router.get('/auth/sso/stats', ssoRoutes.getStats);

// SSO Profile Routes (Protected)
router.get('/auth/sso/profil', verifySSOToken, ssoRoutes.getProfile);
router.put('/auth/sso/profil', verifySSOToken, ssoRoutes.getUploadMiddleware(), updateProfileValidation, ssoRoutes.updateProfile);

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
router.post('/permissions/get', verifySSOToken, permissionsRoutes.listPermissions);
router.post('/permissions/create', verifySSOToken, permissionsRoutes.createPermission);
router.get('/permissions/:id', verifySSOToken, permissionsRoutes.getPermission);
router.put('/permissions/:id', verifySSOToken, permissionsRoutes.updatePermission);
router.delete('/permissions/:id', verifySSOToken, permissionsRoutes.deletePermission);

// Menus
router.post('/menus/create', verifySSOToken, menusRoutes.createMenu);
router.post('/menus/get', verifySSOToken, menusRoutes.listMenus);
router.get('/menus/:id', verifySSOToken, menusRoutes.getMenu);
router.put('/menus/:id', verifySSOToken, menusRoutes.updateMenu);
router.delete('/menus/:id', verifySSOToken, menusRoutes.deleteMenu);

// Companies
router.post('/companies/get', verifySSOToken, companiesRoutes.getCompanies);
router.post('/companies/create', verifySSOToken, companiesRoutes.createCompany);
router.get('/companies/:id', verifySSOToken, companiesRoutes.getCompanyById);
router.put('/companies/:id', verifySSOToken, companiesRoutes.updateCompany);
router.delete('/companies/:id', verifySSOToken, companiesRoutes.deleteCompany);

// Departments
router.post('/departments/get', verifySSOToken, departmentsRoutes.getDepartments);
router.post('/departments/create', verifySSOToken, departmentsRoutes.createDepartment);
router.get('/departments/:id', verifySSOToken, departmentsRoutes.getDepartmentById);
router.put('/departments/:id', verifySSOToken, departmentsRoutes.updateDepartment);
router.delete('/departments/:id', verifySSOToken, departmentsRoutes.deleteDepartment);

// Employees
router.post('/employees/get', verifySSOToken, employeesRoutes.getEmployees);
router.post('/employees/create', verifySSOToken, upload.any(), employeesRoutes.createEmployee);
router.put('/employees/reset_password', verifySSOToken, employeesRoutes.resetPassword);
router.get('/employees/getmenupermission', verifySSOToken, employeesRoutes.getMenuPermissions);
router.get('/employees/:id', verifySSOToken, employeesRoutes.getEmployeeById);
router.put('/employees/:id', verifySSOToken, upload.any(), employeesRoutes.updateEmployee);
router.delete('/employees/:id', verifySSOToken, employeesRoutes.deleteEmployee);

// Titles
router.post('/titles/get', verifySSOToken, titlesRoutes.getTitles);
router.post('/titles/create', verifySSOToken, titlesRoutes.createTitle);
router.get('/titles/:id', verifySSOToken, titlesRoutes.getTitleById);
router.get('/titles/department/:departmentId', verifySSOToken, titlesRoutes.getTitlesByDepartment);
router.put('/titles/:id', verifySSOToken, titlesRoutes.updateTitle);
router.delete('/titles/:id', verifySSOToken, titlesRoutes.deleteTitle);

// Systems
router.post('/systems/create', verifySSOToken, systemsRoutes.createSystem);
router.post('/systems/get', verifySSOToken, systemsRoutes.listSystems);
router.get('/systems/:id', verifySSOToken, systemsRoutes.getSystem);
router.put('/systems/:id', verifySSOToken, systemsRoutes.updateSystem);
router.delete('/systems/:id', verifySSOToken, systemsRoutes.deleteSystem);

// Note: Roles and Users modules have been removed as part of database restructure
// Authentication now uses employees table directly

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
router.get('/menu-has-permissions/menu/:menu_id', menuHasPermissionsRoutes.getPermissionsByMenu);
router.get('/menu-has-permissions/permission/:permission_id', menuHasPermissionsRoutes.getMenusByPermission);
router.get('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.getMenuHasPermission);
router.put('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.updateMenuHasPermission);
router.delete('/menu-has-permissions/:menu_id/:permission_id', menuHasPermissionsRoutes.deleteMenuHasPermission);
router.delete('/menu-has-permissions/menu/:menu_id', menuHasPermissionsRoutes.deleteByMenu);
router.delete('/menu-has-permissions/permission/:permission_id', menuHasPermissionsRoutes.deleteByPermission);

// Note: Role Has Menu Permissions module has been removed
// Permission management now uses employeeHasPermissions table directly

module.exports = router;
