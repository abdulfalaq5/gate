const OnBoardDocumentHandler = require('./handler')

module.exports = {
  getOnBoardDocuments: OnBoardDocumentHandler.getOnBoardDocuments.bind(OnBoardDocumentHandler),
  getOnBoardDocumentById: OnBoardDocumentHandler.getOnBoardDocumentById.bind(OnBoardDocumentHandler),
  createOnBoardDocument: OnBoardDocumentHandler.createOnBoardDocument.bind(OnBoardDocumentHandler),
  updateOnBoardDocument: OnBoardDocumentHandler.updateOnBoardDocument.bind(OnBoardDocumentHandler),
  deleteOnBoardDocument: OnBoardDocumentHandler.deleteOnBoardDocument.bind(OnBoardDocumentHandler)
}

