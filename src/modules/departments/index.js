const DepartmentsHandler = require('./handler');

module.exports = {
  getDepartments: DepartmentsHandler.getDepartments.bind(DepartmentsHandler),
  getDepartmentById: DepartmentsHandler.getDepartmentById.bind(DepartmentsHandler),
  createDepartment: DepartmentsHandler.createDepartment.bind(DepartmentsHandler),
  updateDepartment: DepartmentsHandler.updateDepartment.bind(DepartmentsHandler),
  deleteDepartment: DepartmentsHandler.deleteDepartment.bind(DepartmentsHandler),
  getDepartmentsByCompany: DepartmentsHandler.getDepartmentsByCompany.bind(DepartmentsHandler),
};
