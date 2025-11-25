const jwtDecode = require('jwt-decode')
const { lang } = require('../lang')
const { ROLE } = require('../utils')

const verifyToken = async (req, res, next) => {
  console.log('[verifyToken] Middleware called')
  console.log('[verifyToken] Has authorization header:', !!req?.headers?.authorization)
  
  try {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization.split(' ')[1]
      console.log('[verifyToken] Token extracted, length:', token?.length)
      
      let decode
      try {
        decode = jwtDecode(token)
        console.log('[verifyToken] Token decoded successfully')
        console.log('[verifyToken] Decode keys:', decode ? Object.keys(decode) : 'null')
        console.log('[verifyToken] Decode.roles:', decode?.roles)
        console.log('[verifyToken] Decode.roles type:', typeof decode?.roles)
        console.log('[verifyToken] Decode.roles isArray:', Array.isArray(decode?.roles))
      } catch (decodeError) {
        console.error('[verifyToken] ERROR decoding token:', decodeError)
        console.error('[verifyToken] Decode error message:', decodeError.message)
        return res.status(401).send({
          status: false,
          message: 'Invalid token format',
          data: []
        })
      }
      
      // Safely check roles
      const roles = decode?.roles
      const firstRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : null
      console.log('[verifyToken] First role:', firstRole)
      console.log('[verifyToken] ROLE.CUSTOMER_BUYER:', ROLE.CUSTOMER_BUYER)
      
      if (firstRole === ROLE.CUSTOMER_BUYER) {
        console.log('[verifyToken] Role is CUSTOMER_BUYER, rejecting')
        return res.status(201).send({
          status: false,
          message: lang.__('token.invalid'),
          data: []
        })
      } else {
        console.log('[verifyToken] Token verified, calling next()')
        next()
      }
    } else {
      console.log('[verifyToken] No authorization header, rejecting')
      return res.status(201).send({
        status: false,
        message: lang.__('token.required'),
        data: []
      })
    }
  } catch (error) {
    console.error('[verifyToken] ERROR in verifyToken:', error)
    console.error('[verifyToken] Error name:', error.name)
    console.error('[verifyToken] Error message:', error.message)
    console.error('[verifyToken] Error stack:', error.stack)
    return res.status(500).send({
      status: false,
      message: 'Token verification failed',
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
      if (roles.includes(decode?.roles[0])) {
        next()
      } else {
        response(lang.__('token.invalid'))
      }
    } else {
      response(lang.__('token.required'))
    }
  } catch (error) {
    response(error.toString())
  }
}

const verifyTokenClient = async (req, res, next) => {
  const response = (message) => res.status(201).send({
    status: false,
    message,
    data: []
  })
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization.split(' ')[1]
    const roles = [ROLE.CLIENT_SELLER];
    const decode = jwtDecode(token)
    if (roles.includes(decode?.roles[0])) {
      next()
    } else {
      response(lang.__('token.invalid'))
    }
  } else {
    response(lang.__('token.required'))
  }
}

const verifyTokenAuction = async (req, res, next) => {
  const response = (message) => res.status(201).send({
    status: false,
    message,
    data: []
  })
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization.split(' ')[1]
    const roles = ROLE.AUCTION
    const decode = jwtDecode(token)
    if (roles.includes(decode?.roles[0])) {
      next()
    } else {
      response(lang.__('token.invalid'))
    }
  } else {
    response(lang.__('token.required'))
  }
}

module.exports = {
  verifyToken,
  verifyTokenCustomer,
  verifyTokenClient,
  verifyTokenAuction
}
