const info = {
  description: 'This is API , Made with ❤ by <a href="https://github.com/abdulfalaq5" target="_blank">@abdulfalaq5.</a>',
  version: '1.0.0',
  title: 'API Documentation For Core API',
  contact: {
    email: ''
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

const servers = [
  {
    url: '/api/v1/',
    description: 'Development server'
  },
  {
    url: 'https://',
    description: 'Gateway server'
  }
]

const paths = require('./path')
const schemas = require('./schema')

const index = {
  openapi: '3.0.0',
  info,
  servers,
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas
  }
}

module.exports = {
  index
}
