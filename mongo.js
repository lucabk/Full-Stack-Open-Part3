//import library
const mongoose = require('mongoose')

//checks if arguments are provided 
const inputArgv = process.argv.length

if (inputArgv!==3 && inputArgv!==5){
    console.log("give psw name and number as arguments")
    process.exit(1)
}
//save psw
const psw = process.argv[2]
//set url  connection to cloud db
const url =
  `mongodb+srv://lucabk96:${psw}@fullstackopen.8ip4c.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=FullStackOpen`
//allows you to query fields that are not defined in the schema
mongoose.set('strictQuery',false)
//connection to db
mongoose.connect(url)

//schema definition
const phoneSchema = new mongoose.Schema(
    {
        name: String,
        number: String
    }
)
//model creation
const Person = mongoose.model('Person', phoneSchema)

//Fetching objects from the database
if (inputArgv === 3){
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()//close conn
    })
}

//
else if (inputArgv === 5){
    //new person
    const person = new Person({
        name   :   process.argv[3],
        number :  process.argv[4]
    })
    //saving person to db
    person.save().then( result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()//close conn
    })
}