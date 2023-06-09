const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['src/routes/userRoutes.ts','src/server.ts']

swaggerAutogen(outputFile, endpointsFiles)