// It's important that dotenv gets imported before the note model is imported.
// This ensures that the environment variables from the .env file are available
// globally before the code from the other modules is imported.
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(number => response.send(`<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => response.status(404).json({ error: "not found" }))
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(_ => response.status(204).end())
})

app.post('/api/persons', async (request, response) => {
    const body = request.body
    let errors = []

    if (!body.name) errors.push("name missing")
    if (!body.number) errors.push("number missing")

    let duplicates = await Person.countDocuments({ name: new RegExp(body.name, 'i') }).exec()
    if (duplicates > 0) errors.push("name must be unique")

    if (errors.length > 0)
        return response.status(400).json({
            error: errors.join(', ')
        })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => response.json(savedPerson))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})