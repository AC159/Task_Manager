const  mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {useNewUrlParser: true, useCreateIndex: true})

// User model
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email...')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive...')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Your password contains the word 'password' and is thus very weak!")
            }
        }
    }

})

// Task model
const Task = mongoose.model('Tasks', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const me = new User({
    name: 'AC',
    age: 300,
    email: 'ac1@gmail.com',
    password: 'hell0W0rld'
})

// me.save()
// .then(() => {
//     console.log(me)
// })
// .catch((error) => {
//     console.log('Error!', error)
// })


const task1 = new Task({
    description: 'Learn Metasploit framework'
})

task1.save()
.then(() => {
    console.log(task1)
})
.catch((error) => {
    console.log('Error!', error)
})
