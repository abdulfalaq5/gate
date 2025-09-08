const express = require('express')
const auth = require('../../modules/auth')
const companies = require('../../modules/companies')
const departments = require('../../modules/departments')
const titles = require('../../modules/titles')
const employees = require('../../modules/employees')
const importModule = require('../../modules/import')
const ssoRoutes = require('./sso')
const { verifyToken } = require('../../middlewares')

const routing = express();
const API_TAG = '/api/v1';

/* RULE
naming convention endpoint: using plural
*/

// SSO Routes
routing.use(`${API_TAG}`, ssoRoutes)

// Authentication routes
routing.use(`${API_TAG}/auth`, auth)

// User Management routes (SSO System)
routing.use(`${API_TAG}/companies`, companies)
routing.use(`${API_TAG}/departments`, departments)
routing.use(`${API_TAG}/titles`, titles)
routing.use(`${API_TAG}/employees`, employees)

// Import routes
routing.use(`${API_TAG}/import`, importModule)

module.exports = routing;
