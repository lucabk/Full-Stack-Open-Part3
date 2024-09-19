//we're importing express, which this time is a function 
const express = require("express")
//that is used to create an Express application stored in the app variable
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})