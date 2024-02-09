const mongoose = require('mongoose')

// Usage example
// node mongo.js <password> <name> <number>

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url =
    `mongodb+srv://fullstack:${password}@full-stack-open.0n7kcb6.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person
        .find({})
        .then(persons => {
            console.log("phonebook:")
            persons.forEach(person => console.log(`${person.name} ${person.number}`))
            mongoose.connection.close()
        })
}

else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4] || '',
    })
    
    person.save().then(result => {
        console.log('person saved!', person)
        mongoose.connection.close()
    })
}