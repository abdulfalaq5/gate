const CompaniesHandler = require('./handler');

module.exports = {
  getCompanies: CompaniesHandler.getCompanies.bind(CompaniesHandler),
  getCompanyById: CompaniesHandler.getCompanyById.bind(CompaniesHandler),
  createCompany: CompaniesHandler.createCompany.bind(CompaniesHandler),
  updateCompany: CompaniesHandler.updateCompany.bind(CompaniesHandler),
  deleteCompany: CompaniesHandler.deleteCompany.bind(CompaniesHandler),
  getCompanyHierarchy: CompaniesHandler.getCompanyHierarchy.bind(CompaniesHandler),
  getCompaniesStats: CompaniesHandler.getCompaniesStats.bind(CompaniesHandler),
};
