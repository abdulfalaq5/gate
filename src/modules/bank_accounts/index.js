const BankAccountsHandler = require('./handler')

module.exports = {
  getBankAccounts: BankAccountsHandler.getBankAccounts.bind(BankAccountsHandler),
  getBankAccountById: BankAccountsHandler.getBankAccountById.bind(BankAccountsHandler),
  createBankAccount: BankAccountsHandler.createBankAccount.bind(BankAccountsHandler),
  updateBankAccount: BankAccountsHandler.updateBankAccount.bind(BankAccountsHandler),
  deleteBankAccount: BankAccountsHandler.deleteBankAccount.bind(BankAccountsHandler)
}

