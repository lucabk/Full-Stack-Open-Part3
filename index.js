//It's important that dotenv gets imported before the note model is imported.
require('dotenv').config();
const Person = require('./models/phonebook')
const PORT = process.env.PORT || 3001

//we're importing express, which this time is a function 
const express = require("express")
//that is used to create an Express application stored in the app variable
const app = express()

/*To make Express show static content, the page index.html and the JavaScript, etc., it fetches, 
we need a built-in middleware from Express called static.*/
app.use(express.static('dist'))

//CORS: take the middleware to use and allow for requests from all origins
const cors = require('cors')
app.use(cors())

/*The json-parser middleware takes the JSON data of a request, transforms it into a JavaScript object and then 
attaches it to the body property of the request object before the route handler is called*/
app.use(express.json())

//morgan middleware
const morgan = require("morgan");
//custom token
morgan.token('body', (req) => JSON.stringify(req.body));
//logging with morgan using the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//This middleware will be used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log("Error handler message:",error.message)
  /*The error handler checks if the error is a CastError exception, in which case we know that the error was caused 
  by an invalid object id for Mongo. In this situation, the error handler will send a response to the browser with 
  the response object passed as a parameter. 
  In all other error situations, the middleware passes the error forward to the default Express error handler*/
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
    next(error)// Pass errors to Express
}

//routes:
//GET: defines an event handler that handles HTTP GET requests made to the phonebook path of the application
app.get('/api/persons', (req, res) => {
  //Fetching objects from the database
  Person.find({}).then( phonebook => {
  /*The request is responded to with the json method of the response object. Calling the method will send the 
  phonebook array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type 
  header with the appropriate value of application/json.*/
   res.json(phonebook)    
  })
})

//GET The page has to show the time that the request was received and how many entries are in the phonebook 
app.get('/info', (req, res) => {
  req.requestTime = new Date()
  let text = `<p>Phonebook has info for ${phonebook.length} people</p><p>${req.requestTime.toString()}</p>`
  //There can only be one response.send() statement in an Express app route
  res.send(text)
})

//GET a single entry (the parameters for routes can be defined using the colon syntax)
app.get('/api/persons/:id', (req, res, next) => {
  /* The captured values are populated in the req.params object, with the name of the route parameter 
  specified in the path as their respective keys.*/
  const id = req.params.id
 //Using Mongoose's findById method, fetching an individual number:
  Person.findById(id).then(number => {
    if(number){
      res.json(number)
      console.log(number.toJSON())
    }
    else  
      res.status(404).end()//person not found
    })
  /*Given a malformed id as an argument, the findById method will throw an error causing the returned 
  promise to be rejected. It passes the error forward with the next function. 
  The next function is passed to the handler as the third parameter:*/
  .catch(error => next(error))
})


//DELETE happens by making an HTTP DELETE request to the URL of the resource
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
  /*In both of the "successful" cases of deleting a resource, the backend responds with the status code 204. 
  The two different cases are deleting a note that exists, and deleting a note that does not exist in the databas*/
  .then( result => {
//The 204 (No Content) status code indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response content
    res.status(204).end()
  })
  .catch(err => next(err))//next with an argument -> the execution will continue to the error handler middleware
})


//POST (Without the json-parser, the body property would be undefined)
app.post('/api/persons', (req, res) => {
  const body = req.body
  //new entry
  const newNumber = new Person({
    "name":body.name,
    "number":body.number
  })
  newNumber.save().then(savedPerson => {
    /*The response is sent inside of the callback function for the save operation. 
    This ensures that the response is sent only if the operation succeeded.
    The savedNote parameter in the callback function is the saved and newly created entry. The data 
    sent back in the response is the formatted version created automatically with the toJSON method*/
    res.json(savedPerson)
  })
})

//PUT
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  //regular JS object (not a new note object created with the Person constructor function)
  const newNumber = {
    name:body.name,
    number:body.number
  }
  /*Model.findByIdAndUpdate(id, update, options) 
  -id «Object|Number|String» value of _id to query by, -[update] «Object», 
  -[options.new=false] «Boolean» if true, return the modified document rather than the original*/
  Person.findByIdAndUpdate(req.params.id, newNumber, {new:true})
    .then( upNumber => {
      res.json(upNumber)
    })
    .catch( error => next(error))
})

/*catch unknown route. It's also important that the middleware for handling unsupported routes 
is next to the last middleware that is loaded into Express, just before the error handler*/
app.use(unknownEndpoint)

//the error handler needs to come at the very end, after the unknown endpoints handler.
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})