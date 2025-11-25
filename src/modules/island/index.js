const { Router } = require('express')
const IslandHandler = require('./handler')
const { verifyToken } = require('../../middlewares')
const { validateIslandId } = require('./validation')

const router = Router()

// POST /api/island/get - Get all islands with pagination and filtering
router.post('/get', verifyToken, (req, res, next) => {
  console.log('='.repeat(80))
  console.log('[Route] POST /api/island/get - Route matched')
  console.log('[Route] Request received, calling handler...')
  console.log('='.repeat(80))
  next()
}, IslandHandler.getIslands.bind(IslandHandler))

// POST /api/island/create - Create new island
router.post('/create', verifyToken, IslandHandler.createIsland.bind(IslandHandler))

// GET /api/island/:id - Get island by ID
router.get('/:id', verifyToken, (req, res, next) => {
  const { id } = req.params
  if (!validateIslandId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid island ID format',
      timestamp: new Date().toISOString()
    })
  }
  next()
}, IslandHandler.getIslandById.bind(IslandHandler))

// PUT /api/island/:id - Update island
router.put('/:id', verifyToken, (req, res, next) => {
  const { id } = req.params
  if (!validateIslandId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid island ID format',
      timestamp: new Date().toISOString()
    })
  }
  next()
}, IslandHandler.updateIsland.bind(IslandHandler))

// DELETE /api/island/:id - Delete island
router.delete('/:id', verifyToken, (req, res, next) => {
  const { id } = req.params
  if (!validateIslandId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid island ID format',
      timestamp: new Date().toISOString()
    })
  }
  next()
}, IslandHandler.deleteIsland.bind(IslandHandler))

module.exports = router

