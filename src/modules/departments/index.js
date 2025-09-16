const express = require('express')
const { verifySSOToken } = require('../../middlewares')
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByCompany
} = require('./handler')

const router = express.Router()

// All routes require SSO authentication
router.use(verifySSOToken)

// Departments routes
router.get('/', getDepartments)
router.get('/company/:companyId', getDepartmentsByCompany)
router.get('/:id', getDepartmentById)
router.post('/', createDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

module.exports = router
