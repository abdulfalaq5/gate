const BackgroundCheckHandler = require('./handler')

module.exports = {
  getBackgroundChecks: BackgroundCheckHandler.getBackgroundChecks.bind(BackgroundCheckHandler),
  getBackgroundCheckById: BackgroundCheckHandler.getBackgroundCheckById.bind(BackgroundCheckHandler),
  createBackgroundCheck: BackgroundCheckHandler.createBackgroundCheck.bind(BackgroundCheckHandler),
  updateBackgroundCheck: BackgroundCheckHandler.updateBackgroundCheck.bind(BackgroundCheckHandler),
  deleteBackgroundCheck: BackgroundCheckHandler.deleteBackgroundCheck.bind(BackgroundCheckHandler)
}

