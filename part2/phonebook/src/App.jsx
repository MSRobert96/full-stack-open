import { useEffect, useState } from 'react'
import personsService from './services/personsService'

const Filter = ({ value, onChange }) =>
    <div>
        filter shown with <input type="text" value={value} onChange={onChange} />
    </div>

const PersonForm = ({ newName, newNumber, onSubmit, onNameChange, onNumberChange }) =>
    <form onSubmit={onSubmit}>
        <div>name: <input value={newName} onChange={onNameChange} /></div>
        <div>number: <input value={newNumber} onChange={onNumberChange} /></div>
        <div><button type="submit">add</button></div>
    </form>

const Persons = ({ persons, handleDelete }) =>
    persons.map(person =>
        <div key={person.id}>
            <span>{person.name} {person.number}</span>
            <button onClick={handleDelete(person)}>delete</button>
        </div>
    )

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        personsService.getAll()
            .then(initialPersons => setPersons(initialPersons))
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        let existingPerson = persons.find(p => p.name == newName)

        if (existingPerson !== undefined) {

            if (!window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`))
                return // abort update

            // update existing person
            personsService.update(existingPerson.id, { ...existingPerson, number: newNumber })
                .then(updatedPerson => {
                    setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p))
                    setNewName('')
                    setNewNumber('')
                })
        }

        else {
            // create new person
            personsService.create({ name: newName, number: newNumber })
                .then(createdPerson => {
                    setPersons(persons.concat(createdPerson))
                    setNewName('')
                    setNewNumber('')
                })
        }

    }

    const handlePersonDelete = (person) => () => {
        if (!window.confirm(`Delete ${person.name} ?`))
            return

        personsService.remove(person.id)
            .then(deletedPerson => setPersons(persons.filter(person => person.id != deletedPerson.id)))
    }

    const personsToShow = search.trim() == ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={search} onChange={(event => setSearch(event.target.value))} />

            <h3>add a new</h3>

            <PersonForm
                onSubmit={addPerson}
                newName={newName}
                newNumber={newNumber}
                onNameChange={(event) => setNewName(event.target.value)}
                onNumberChange={(event) => setNewNumber(event.target.value)} />

            <h3>Numbers</h3>

            <Persons persons={personsToShow} handleDelete={handlePersonDelete} />
        </div>
    )
}

export default App