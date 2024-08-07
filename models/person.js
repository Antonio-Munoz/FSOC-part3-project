const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose.connect(url.toString()).then(result => {
    console.log('Connected to MongoDB')
})
.catch(error => {
    console.log('error connectin to MongoDB', error.message)
})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: n => /^624\d{7}$/.test(n),
            message: props => `${props.value} is not a valid number`
        },
        required: true
    }
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)