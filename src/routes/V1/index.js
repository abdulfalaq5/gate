const express = require('express')
const auth = require('../../modules/auth')
const companies = require('../../modules/companies')
const departments = require('../../modules/departments')
const importModule = require('../../modules/import')
const island = require('../../modules/island')
// employeeHasPermissions module removed
const ssoRoutes = require('./sso')
const { verifyToken, verifySSOToken } = require('../../middlewares')

const routing = express();
const API_TAG = '/api';

/* RULE
naming convention endpoint: using plural
*/

// SSO Routes
routing.use(`${API_TAG}`, ssoRoutes)

// Authentication routes
routing.use(`${API_TAG}/auth`, auth)

// Import routes
routing.use(`${API_TAG}/import`, importModule)

// Island routes
routing.use(`${API_TAG}/island`, verifyToken, island)

// Employee Has Permissions routes removed

module.exports = routing;
