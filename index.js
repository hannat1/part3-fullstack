require('dotenv').config()
const express = require('express')
const Phonebook = require('./models/person')
var morgan = require('morgan')

const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.get('/info', (request, response) => {
  Phonebook.find({}).then((persons) => {
    response.send(`
      <h1>Phonebook has info for ${persons.length} people</h1>
      <p>${new Date()}</p>
    `)
  })
})

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Phonebook.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Phonebook.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name) return response.status(400).json({ error: 'name is missing' })
  if (!number) return response.status(400).json({ error: 'number is missing' })

  const person = new Phonebook({ name, number })
  person
    .save()
    .then((saved) => response.json(saved))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phonebook.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
