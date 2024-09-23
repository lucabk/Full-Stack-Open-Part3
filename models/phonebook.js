//import library
const mongoose = require('mongoose')
//set url  connection to cloud db
const url = process.env.MONGODB_URI
//allows you to query fields that are not defined in the schema
mongoose.set('strictQuery',false)

//connection to db
console.log('connecting to', url,'...')
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
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
