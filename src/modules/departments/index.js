const express = require('express')
const { verifyToken } = require('../../middlewares')
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByCompany
} = require('./handler')

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

// Departments routes
router.get('/', getDepartments)
router.get('/company/:companyId', getDepartmentsByCompany)
router.get('/:id', getDepartmentById)
router.post('/', createDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

module.exports = router
