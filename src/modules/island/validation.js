const { islandsColumns, islandsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')

/**
 * Validate island data for different operations
 */
const validateIsland = (data, operation = 'create') => {
  const rules = operation === 'create' 
    ? islandsValidationRules.create 
    : islandsValidationRules.update
  
  return validateRequest(data, rules, islandsColumns)
}

/**
 * Validate UUID format for island ID
 */
const validateIslandId = (id) => {
  const { validateUUID } = require('../../utils/validation')
  return validateUUID(id)
}

module.exports = {
  validateIsland,
  validateIslandId
}

