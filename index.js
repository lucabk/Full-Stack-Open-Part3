const app = require('./app') //the actual Express application
const config = require('./utils/config') //dotenv config
const logger = require('./utils/logger') //console logger

//The index.js file only imports the actual application from the app.js file and then starts the application
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})