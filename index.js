//we're importing express, which this time is a function 
const express = require("express")
//morgan middleware
const morgan = require("morgan")
//that is used to create an Express application stored in the app variable
const app = express()

/*The json-parser middleware takes the JSON data of a request, transforms it into a JavaScript object and then 
attaches it to the body property of the request object before the route handler is called*/
app.use(express.json())
//custom token
morgan.token('body', (req) => JSON.stringify(req.body));
//logging with morgan using the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//This middleware will be used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//data
let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

generateId = () => String(Math.floor(Math.random() * 1000000))

//routes:
//GET: defines an event handler that handles HTTP GET requests made to the phonebook path of the application
app.get('/api/persons', (req, res) => {
    /*The request is responded to with the json method of the response object. Calling the method will send the 
    phonebook array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type 
    header with the appropriate value of application/json.*/
    res.json(phonebook)
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
  //the number variable is set to undefined if no matching note is found. 
  number = phonebook.find( n => n.id === id)
  if(number) 
    res.json(number)
  else 
    /*Use ".end()" to quickly end the response without any data. 
    If no note is found, the server should respond with the status code 404 not found*/
    res.status(404).end()
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

  //The request is not allowed to succeed, if:The name or number is missing
  if (body.name === "" || body.number === "")
    return res.status(400).json({ error: 'name or number required' })
  //The name already exists in the phonebook
  if (phonebook.find( n => n.name === body.name))
    return res.status(400).json({ error: 'name must be unique' })
   

  const newNumber = {
    "id": generateId(),
    "name":body.name,
    "number":body.number
  }
  //console.log(req.headers)//print all of the request headers
  //console.log(newNumber)//print the new entry

  phonebook = phonebook.concat(newNumber)//add the new entry
  res.json(newNumber)//send back the new entry
})

//catch unknown route
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})