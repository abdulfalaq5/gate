const express = require('express')
const { verifyToken } = require('../../middlewares')
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyHierarchy,
  getCompaniesStats
} = require('./handler')

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

// Companies routes
router.get('/', getCompanies)
router.get('/hierarchy', getCompanyHierarchy)
router.get('/stats', getCompaniesStats)
router.get('/:id', getCompanyById)
router.post('/', createCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)

module.exports = router
