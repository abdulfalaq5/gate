const express = require('express')
const auth = require('../../modules/auth')
const companies = require('../../modules/companies')
const departments = require('../../modules/departments')
const titles = require('../../modules/titles')
const employeesRouter = require('../../modules/employees/router')
const importModule = require('../../modules/import')
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

// Other User Management routes (SSO System)
routing.use(`${API_TAG}/titles`, titles)

// Import routes
routing.use(`${API_TAG}/import`, importModule)

module.exports = routing;
