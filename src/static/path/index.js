const adminMenu = require('./admin_menu.json')
const auth = require('./auth.json')
const authMember = require('./auth_member.json')
const backgroundCheck = require('./background_check.json')
const bankAccounts = require('./bank_accounts.json')
const candidates = require('./candidates.json')
const companies = require('./companies.json')
const customers = require('./customers.json')
const departments = require('./departments.json')
const employees = require('./employees.json')
const employeesImport = require('./employees_import.json')
const importModule = require('./import.json')
const permissions = require('./permissions.json')
const scheduleInterview = require('./schedule_interview.json')
const interview = require('./interview.json')
const ssoProfile = require('./sso_profile.json')
const systems = require('./systems.json')
const titles = require('./titles.json')
const onBoardDocument = require('./on_board_document.json')
const note = require('./note.json')

module.exports = {
  ...auth,
  ...adminMenu,
  ...authMember,
  ...backgroundCheck,
  ...bankAccounts,
  ...candidates,
  ...companies,
  ...customers,
  ...departments,
  ...employees,
  ...employeesImport,
  ...importModule,
  ...permissions,
  ...scheduleInterview,
  ...interview,
  ...ssoProfile,
  ...systems,
  ...titles,
  ...onBoardDocument,
  ...note
}