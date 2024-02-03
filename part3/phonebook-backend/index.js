const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

const generateId = () => {
    let ids = persons.map(p => p.id)
    let randId;
    while (!randId || ids.find(id => id === randId))
        randId = Math.random() * 100000000
    return randId
}

app.get('/', (request, response) => {
    response.send('<h1>Persons api home</h1>')
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person)
        response.json(person)
    else
        response.status(404).json({
            error: "not found"
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    let errors = []
    if (!body.name)
        errors.push("name missing")
    else if (persons.find(p => p.name.toLowerCase() == body.name.toLowerCase()))
        errors.push("name must be unique")

    if (!body.number) errors.push("number missing")

    if (errors.length > 0)
        return response.status(400).json({
            error: errors.join(', ')
        })

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})