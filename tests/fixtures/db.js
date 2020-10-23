const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user.js')
const Task = require('../../src/models/task.js')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'AC',
    email: 'anacap1100@gmail.com',
    age: 20,
    password: 'test1234hello',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'ACTwo',
    email: 'anacap1200@gmail.com',
    age: 20,
    password: 'test1234hello',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Finish internship',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}



const setupDatabase = async function (){

    await Task.deleteMany()  // Delete all tasks from the db before each test
    await User.deleteMany()  // Delete all users from the db before each test

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}

module.exports = {
    taskOne,
    taskTwo,
    taskThree,
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    setupDatabase
}