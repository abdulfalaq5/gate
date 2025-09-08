const express = require('express')
const auth = require('../../modules/auth')
const products = require('../../modules/products')
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

// Products routes - public endpoints (no auth required)
routing.use(`${API_TAG}/products`, products)

module.exports = routing;
