require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('postMorgan', (request, response) => {
    if(request.method == 'POST'){
        return JSON.stringify(request.body) 
    }
})
app.use(morgan(':method :url :status :response-time :postMorgan'))

app.get('/', (request, response) => {
    response.send('<h1>Jelouda bro!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for people <br/> ${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    const pid = persons.includes(...persons.map(p => p.id))
    ? Math.floor(Math.random() * 1000)
    : Math.floor(Math.random() * 1000)

    return pid
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "Name or number are missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

//error handling in middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CasstError'){
        return response.status(400).send({ error: 'some error happened bro'})
    }else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})