const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://db_user:${password}@cluster0.v249zli.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=noteApp`

mongoose.set("strictQuery", false)
mongoose.connect(url, { family: 4 })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneBook = mongoose.model("PhoneBook", phoneBookSchema)

if (name && number) {
  const phoneEntry = new PhoneBook({ name, number })
  phoneEntry.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  PhoneBook.find({}).then((result) => {
    console.log("Phonebook:")
    result.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}
