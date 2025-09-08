const express = require('express')
const { verifyToken } = require('../../middlewares')
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByTitle
} = require('./handler')

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

// Employees routes
router.get('/', getEmployees)
router.get('/title/:titleId', getEmployeesByTitle)
router.get('/:id', getEmployeeById)
router.post('/', createEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

module.exports = router
