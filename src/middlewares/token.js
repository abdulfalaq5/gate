const jwtDecode = require('jwt-decode')
const { lang } = require('../lang')
const { ROLE } = require('../utils')

const verifyToken = async (req, res, next) => {
  const logPrefix = '[verifyToken]'
  
  try {
    console.log(`${logPrefix} ========== MIDDLEWARE CALLED ==========`)
    console.log(`${logPrefix} Request path:`, req.path)
    console.log(`${logPrefix} Has authorization header:`, !!req?.headers?.authorization)
    
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization.split(' ')[1]
      console.log(`${logPrefix} Token extracted:`, token ? 'Yes' : 'No')
      
      if (!token) {
        console.error(`${logPrefix} ❌ Token is empty after split`)
        return res.status(201).send({
          status: false,
          message: lang.__('token.required'),
          data: []
        })
      }
      
      let decode
      try {
        decode = jwtDecode(token)
        console.log(`${logPrefix} Token decoded successfully`)
        console.log(`${logPrefix} Decoded token:`, JSON.stringify(decode, null, 2))
      } catch (decodeError) {
        console.error(`${logPrefix} ❌ Error decoding token:`, decodeError)
        console.error(`${logPrefix} Decode error stack:`, decodeError.stack)
        return res.status(201).send({
          status: false,
          message: lang.__('token.invalid'),
          data: []
        })
      }
      
      // Safely check roles with optional chaining
      const firstRole = decode?.roles?.[0]
      console.log(`${logPrefix} First role:`, firstRole)
      console.log(`${logPrefix} Roles array:`, decode?.roles)
      console.log(`${logPrefix} Roles is array:`, Array.isArray(decode?.roles))
      
      if (firstRole === ROLE.CUSTOMER_BUYER) {
        console.log(`${logPrefix} ❌ Customer buyer role detected, rejecting`)
        return res.status(201).send({
          status: false,
          message: lang.__('token.invalid'),
          data: []
        })
      } else {
        console.log(`${logPrefix} ✅ Token verified, proceeding to next`)
        next()
      }
    } else {
      console.error(`${logPrefix} ❌ No authorization header`)
      return res.status(201).send({
        status: false,
        message: lang.__('token.required'),
        data: []
      })
    }
  } catch (error) {
    console.error(`${logPrefix} ❌❌❌ FATAL ERROR IN verifyToken ❌❌❌`)
    console.error(`${logPrefix} Error name:`, error?.name)
    console.error(`${logPrefix} Error message:`, error?.message)
    console.error(`${logPrefix} Error stack:`, error.stack)
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      data: []
    })
  }
}

const verifyTokenCustomer = async (req, res, next) => {
  const response = (message) => res.status(201).send({
    status: false,
    message,
    data: []
  })
  try {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization.split(' ')[1]
      const roles = ['front', 'Customer-Buyer'];
      const decode = jwtDecode(token)
      // Safely check roles with optional chaining
      const firstRole = decode?.roles?.[0]
      if (firstRole && roles.includes(firstRole)) {
        next()
      } else {
        response(lang.__('token.invalid'))
      }
    } else {
      response(lang.__('token.required'))
    }
  } catch (error) {
    console.error('[verifyTokenCustomer] Error:', error)
    response(error.toString())
  }
}

const verifyTokenClient = async (req, res, next) => {
  const response = (message) => res.status(201).send({
    status: false,
    message,
    data: []
  })
  try {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization.split(' ')[1]
      const roles = [ROLE.CLIENT_SELLER];
      const decode = jwtDecode(token)
      // Safely check roles with optional chaining
      const firstRole = decode?.roles?.[0]
      if (firstRole && roles.includes(firstRole)) {
        next()
      } else {
        response(lang.__('token.invalid'))
      }
    } else {
      response(lang.__('token.required'))
    }
  } catch (error) {
    console.error('[verifyTokenClient] Error:', error)
    response(error.toString())
  }
}

const verifyTokenAuction = async (req, res, next) => {
  const response = (message) => res.status(201).send({
    status: false,
    message,
    data: []
  })
  try {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization.split(' ')[1]
      const roles = ROLE.AUCTION
      const decode = jwtDecode(token)
      // Safely check roles with optional chaining
      const firstRole = decode?.roles?.[0]
      if (firstRole && roles.includes(firstRole)) {
        next()
      } else {
        response(lang.__('token.invalid'))
      }
    } else {
      response(lang.__('token.required'))
    }
  } catch (error) {
    console.error('[verifyTokenAuction] Error:', error)
    response(error.toString())
  }
}

module.exports = {
  verifyToken,
  verifyTokenCustomer,
  verifyTokenClient,
  verifyTokenAuction
}
