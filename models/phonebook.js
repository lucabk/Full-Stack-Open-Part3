//import library
const mongoose = require('mongoose')
//set url  connection to cloud db
const config = require('../utils/config')
const url = config.MONGODB_URI
//logger
const logger = require('../utils/logger')
//allows you to query fields that are not defined in the schema
mongoose.set('strictQuery',false)


//connection to db
logger.info('connecting to', url,'...')
mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.info('error connecting to MongoDB:', error.message)
  })

//schema definition and (custom) validation
const phoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      required: true,
      validate : {
        validator: function(n){
          return /^\d{2,3}-\d+$/.test(n)
        },
        message:props => `${props.value} is not a valid phone number!`
      }
    }
  }
)
phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


//model creation and export
//The public interface of the module is defined by setting a value to the module.exports variable
module.exports =  mongoose.model('Person', phoneSchema)
