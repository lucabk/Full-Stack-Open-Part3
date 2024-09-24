//we're importing express, which this time is a function
const express = require('express')
//that is used to create an Express application stored in the app variable
const app = express()
//CORS: take the middleware to use and allow for requests from all origins
const cors = require('cors')
//mongoose settings
const Person = require('./models/phonebook')
//The router we defined earlier is used if the URL of the request starts with /api/persons
const router = require('./controllers/routes')
//middleware for error handling and unknown endpoint
const middleware = require('./utils/middleware')
//morgan middleware
const morgan = require('morgan')
//custom token
morgan.token('body', (req) => JSON.stringify(req.body))


//logging with morgan using the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
/*To make Express show static content, the page index.html and the JavaScript, etc., it fetches,
we need a built-in middleware from Express called static.*/
app.use(express.static('dist'))
/*The json-parser middleware takes the JSON data of a request, transforms it into a JavaScript object and then
attaches it to the body property of the request object before the route handler is called*/
app.use(express.json())

//routes: /apu/persons GET,POST,PUT and DELETE:
app.use('/api/persons', router)
//GET The page has to show the time that the request was received and how many entries are in the phonebook
app.get('/info', (req, res) => {
  req.requestTime = new Date()
  Person.find({}).then( phonebook => {
    let text = `<p>Phonebook has info for ${phonebook.length} people</p><p>${req.requestTime.toString()}</p>`
    //There can only be one response.send() statement in an Express app route
    res.send(text)
  })
})

/*catch unknown route. It's also important that the middleware for handling unsupported routes
is next to the last middleware that is loaded into Express, just before the error handler*/
app.use(middleware.unknownEndpoint)

//the error handler needs to come at the very end, after the unknown endpoints handler.
app.use(middleware.errorHandler)

module.exports = app