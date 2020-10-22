const request = require('supertest')
const app = require('../app.js')
const User = require('../src/models/user.js')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

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


beforeEach(async () => {
    await User.deleteMany()  // Delete all users from the db before each test
    await new User(userOne).save()
})


test('Should sign up a new user', async () => {

    const response = await request(app).post('/users').send({
        name: 'Anastassy',
        email: 'anastassy100@gmail.com',
        age: 20,
        password: 'test1234hello'
    }).expect(201)

    // Assert the db was changed correctly:
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response:
    expect(response.body).toMatchObject({
        user: {
            name: 'Anastassy',
            email: 'anastassy100@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('test1234hello')

})

test('should login existing user', async () => {

    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById({ _id: response.body.user._id })

    expect(response.body.token).toBe(user.tokens[1].token)

})

test('should not login non-existent user', async () => {

    await request(app).post('/users/login').send({
        email: 'userOne.email',
        password: userOne.password
    }).expect(400)

})

test('should get profile for user', async () => {

    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})

test('should not get profile for unauthenticated user', async () => {

    await request(app)
        .get('/users/me')
        .send()
        .expect(401)

})

test('should delete account for user', async () => {

    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()

})

test('should not delete account for unauthenticated user', async () => {

    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)

})
