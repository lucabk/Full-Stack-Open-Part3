//import library
const mongoose = require('mongoose')
//set url  connection to cloud db
const url = process.env.MONGODB_URI
//allows you to query fields that are not defined in the schema
mongoose.set('strictQuery',false)

//connection to db
console.log('connecting to', url,"...")
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

//schema definition
const phoneSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: true
        },
        number: String
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
