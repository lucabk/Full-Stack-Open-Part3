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
const phonebook = require('./models/phonebook');
//custom token
morgan.token('body', (req) => JSON.stringify(req.body));
//logging with morgan using the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//This middleware will be used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
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
app.get('/api/persons/:id', (req, res) => {
  /* The captured values are populated in the req.params object, with the name of the route parameter 
  specified in the path as their respective keys.*/
  const id = req.params.id
 //Using Mongoose's findById method, fetching an individual number:
  Person.findById(id).then(number => {
  res.json(number)
  console.log(number.toJSON())
})
})


//DELETE happens by making an HTTP DELETE request to the URL of the resource
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  phonebook = phonebook.filter( n => n.id !== id)
  //The 204 (No Content) status code indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response content
  res.status(204).end()
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

//catch unknown route
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})