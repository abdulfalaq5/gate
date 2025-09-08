const MenusHandler = require('./handler');

module.exports = {
  createMenu: MenusHandler.createMenu.bind(MenusHandler),
  getMenu: MenusHandler.getMenu.bind(MenusHandler),
  listMenus: MenusHandler.listMenus.bind(MenusHandler),
  getMenuTree: MenusHandler.getMenuTree.bind(MenusHandler),
  updateMenu: MenusHandler.updateMenu.bind(MenusHandler),
  deleteMenu: MenusHandler.deleteMenu.bind(MenusHandler),
};