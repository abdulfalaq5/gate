const { logger, logDateFormat, fullDateFormat } = require('../utils')
const { initAuctionTrx } = require('./auction_result_listener')
const { initEmailServices } = require('./email_listener')
const { initInspectionTrx } = require('./inspection_listener')
const { initKtpProcessing } = require('./ktp_listener')

const initListener = async () => {
  const fileName = `listener-${logDateFormat()}.txt`
  try {
    console.info('Listener is working waiting for message')
    await initAuctionTrx()
    await initEmailServices()
    await initInspectionTrx()
    await initKtpProcessing()
    logger(fileName, 'listener').write(`Listener is working waiting for message ${fullDateFormat(new Date().toISOString())} \n`)
  } catch (error) {
    console.info('Listener is not working with error', error)
    logger(fileName, 'listener').write(`Listener is not working with error ${fullDateFormat(new Date().toISOString())} ${error}\n`)
  }
}

module.exports = {
  initListener
}
