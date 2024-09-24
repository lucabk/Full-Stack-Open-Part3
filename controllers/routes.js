const router = require('express').Router()//A router object is an instance of middleware and routes
const Person = require('../models/phonebook')

//GET: defines an event handler that handles HTTP GET requests made to the phonebook path of the application
router.get('/', (req, res) => {
  //Fetching objects from the database
  Person.find({}).then( phonebook => {
  /*The request is responded to with the json method of the response object. Calling the method will send the
  phonebook array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type
  header with the appropriate value of application/json.*/
    res.json(phonebook)
  })
})


//GET a single entry (the parameters for routes can be defined using the colon syntax)
router.get('/:id', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
  /*In both of the "successful" cases of deleting a resource, the backend responds with the status code 204.
  The two different cases are deleting a note that exists, and deleting a note that does not exist in the databas*/
    .then( () => {
      //The 204 (No Content) status code indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response content
      res.status(204).end()
    })
    .catch(err => next(err))//next with an argument -> the execution will continue to the error handler middleware
})


//POST (Without the json-parser, the body property would be undefined)
router.post('/', (req, res, next) => {
  const body = req.body
  //new entry
  const newNumber = new Person({
    'name':body.name,
    'number':body.number
  })
  newNumber.save().then(savedPerson => {
    /*The response is sent inside of the callback function for the save operation.
    This ensures that the response is sent only if the operation succeeded.
    The savedNote parameter in the callback function is the saved and newly created entry. The data
    sent back in the response is the formatted version created automatically with the toJSON method*/
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

//PUT
router.put('/:id', (req, res, next) => {
  const { name, number } = req.body

  /*Model.findByIdAndUpdate(id, update, options)
  -id «Object|Number|String» value of _id to query by, -[update] «Object»,
  -[options.new=false] «Boolean» if true, return the modified document rather than the original*/
  Person.findByIdAndUpdate(req.params.id, { name,number }, { new:true, runValidators:true, context:'query' })
    .then( upNumber => {
      //if upNumber === NULL return a 404 (it will not trigger catch automatically)
      if (!upNumber) {
        return res.status(400).json({ error: 'Person not found' })
      }
      res.json(upNumber)
    })
    .catch( error => next(error))
})

module.exports = router