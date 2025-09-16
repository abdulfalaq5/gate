const express = require('express')
const { verifySSOToken } = require('../../middlewares')
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

// All routes require SSO authentication
router.use(verifySSOToken)

// Companies routes
router.get('/', getCompanies)
router.get('/hierarchy', getCompanyHierarchy)
router.get('/stats', getCompaniesStats)
router.get('/:id', getCompanyById)
router.post('/', createCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)

module.exports = router
