const express = require('express')
const { verifyToken } = require('../../middlewares')
const {
  getTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
  getTitlesByDepartment
} = require('./handler')

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

// Titles routes
router.get('/', getTitles)
router.get('/department/:departmentId', getTitlesByDepartment)
router.get('/:id', getTitleById)
router.post('/', createTitle)
router.put('/:id', updateTitle)
router.delete('/:id', deleteTitle)

module.exports = router
