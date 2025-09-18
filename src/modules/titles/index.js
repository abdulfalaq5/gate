const TitlesHandler = require('./handler');

module.exports = {
  getTitles: TitlesHandler.getTitles.bind(TitlesHandler),
  getTitleById: TitlesHandler.getTitleById.bind(TitlesHandler),
  createTitle: TitlesHandler.createTitle.bind(TitlesHandler),
  updateTitle: TitlesHandler.updateTitle.bind(TitlesHandler),
  deleteTitle: TitlesHandler.deleteTitle.bind(TitlesHandler),
  getTitlesByDepartment: TitlesHandler.getTitlesByDepartment.bind(TitlesHandler),
};
