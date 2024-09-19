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
//GET:  defines an event handler that handles HTTP GET requests made to the phonebook path of the application
app.get('/api/persons', (req, res) => {
    /*The request is responded to with the json method of the response object. Calling the method will send the 
    phonebook array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type 
    header with the appropriate value of application/json.*/
    res.json(phonebook)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})