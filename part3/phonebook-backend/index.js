// It's important that dotenv gets imported before the note model is imported.
// This ensures that the environment variables from the .env file are available
// globally before the code from the other modules is imported.
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(number => response.send(`<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`))
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => next(error))
})

app.post('/api/persons', async (request, response, next) => {
    const body = request.body

    let duplicates = await Person.countDocuments({ name: new RegExp(body.name, 'i') }).exec()
    if (duplicates > 0)
        return response.status(400).json({ error: 'name must be unique' }).end()

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})