import { useState } from 'react'

const Filter = ({value, onChange}) => 
    <div>
        filter shown with 
        <input type="text" value={value} onChange={onChange} />
    </div>

const PersonForm = ({newName, newNumber, onSubmit, onNameChange, onNumberChange}) => 
    <form onSubmit={onSubmit}>
        <div>name: <input value={newName} onChange={onNameChange} /></div>
        <div>number: <input value={newNumber} onChange={onNumberChange} /></div>
        <div><button type="submit">add</button></div>
    </form>

const Persons = ({ persons }) => 
    <>
        {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </>
    

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')

    const addPerson = (event) => {
        event.preventDefault()
        console.log(persons)
        if (persons.filter(person => person.name == newName).length > 0) {
            alert(`${newName} is already added to phonebook`)
            return
        }

        setPersons(persons.concat({ name: newName, number: newNumber }))
        setNewName('')
        setNewNumber('')
    }

    const personsToShow = search == ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()) )

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

            <Persons persons={personsToShow} />
        </div>
    )
}

export default App