const  mongoose = require('mongoose')

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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // We can fetch the entire User model whenever we have access to a task
    }
})

module.exports = Task