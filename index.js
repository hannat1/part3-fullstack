const express = require("express")
var morgan = require("morgan")

const app = express()

app.use(morgan("tiny"))
app.use(express.json())
const cors = require("cors")

app.use(cors())

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovalace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/", (request, response) => {
  response.send("<h1>HelloWorld!</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

const count = persons.length
const time = new Date()
app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${count} people </p>
     <p> ${time}</p>`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  id = Math.floor(Math.random() * 1000)
  string_id = id.toString()
  console.log(string_id, "string_id")
  return string_id
}

const nameExists = (name) => {
  const names = persons.map((person) => person.name === name)
  return names.includes(true)
}

app.post("/api/persons", (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    })
  }
  if (nameExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
