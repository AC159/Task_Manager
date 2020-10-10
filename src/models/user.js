const  mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('.\\task.js')

// User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
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
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Your password contains the word 'password' and is thus very weak!")
            }
        }
    },
    tokens: [{  // Each user has an array of objects containing a token
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.GenerateAuthToken = async function() {

    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token })  // Add the user's token to tokens' array

    await user.save() // Save user + token to db

    return token

}

userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar  // Remove the avatar of the user in a json response so as to make it faster

    return userObject

}


userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email : email})

    if (!user){
        throw new Error('Unable to login...')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        throw new Error('Unable to login...')
    }

    return user

}

// Middleware
userSchema.pre('save', async function (next) {

    const user = this

    // Hash the password if it was modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {

    const user = this
    await Task.deleteMany({ owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User