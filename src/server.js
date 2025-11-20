// make sure for crashing handler continues to run
const app = require('./app')

process.on('warning', (warning) => {
  console.warn(warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})

const unhandledRejections = new Map()
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason)
  console.error('\n')
  console.error('='.repeat(80))
  console.error('❌❌❌ UNHANDLED PROMISE REJECTION ❌❌❌')
  console.error('Promise:', promise)
  console.error('Reason:', reason)
  console.error('Reason type:', typeof reason)
  console.error('Reason name:', reason?.name)
  console.error('Reason message:', reason?.message)
  if (reason && typeof reason === 'object') {
    console.error('Reason stack:', reason.stack)
    console.error('Reason full:', JSON.stringify(reason, Object.getOwnPropertyNames(reason), 2))
  }
  console.error('='.repeat(80))
  console.error('\n')
})
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise)
  console.log('✅ Promise rejection handled:', promise)
})

process.on('uncaughtException', (err, origin) => {
  console.error('\n')
  console.error('='.repeat(80))
  console.error('❌❌❌ UNCAUGHT EXCEPTION ❌❌❌')
  console.error('Error:', err)
  console.error('Error name:', err?.name)
  console.error('Error message:', err?.message)
  console.error('Error stack:', err?.stack)
  console.error('Origin:', origin)
  console.error('='.repeat(80))
  console.error('\n')
})

process.on('SIGTERM', () => {
  console.info('SIGTERM received')
})

app.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`${process?.env.APP_NAME} running in port ${process.env.APP_PORT}`)
  } else {
    console.info(`${process?.env.APP_NAME} is running`)
  }
})
