const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('Connecting to ', url)

mongoose.connect(url.toString()).then(result => {
    console.log('Connected to MongoDB')
})
.catch(error => {
    console.log('error connectin to MongoDB', error.message)
})

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)