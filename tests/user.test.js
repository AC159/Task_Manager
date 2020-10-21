const request = require('supertest')
const app = require('../app.js')
const User = require('../src/models/user.js')

const userOne = {
    name: 'AC',
    email: 'anacap100@gmail.com',
    age: 20,
    password: 'test1234hello'
}


beforeEach(async () => {
    await User.deleteMany()  // Delete all users from the db before each test
    await new User(userOne).save()
})


test('Should sign up a new user', async () => {

    await request(app).post('/users').send({
        name: 'Anastassy',
        email: 'Anastassy100@gmail.com',
        age: 20,
        password: 'test1234hello'
    }).expect(201)

})

test('should login existing user', async () => {

    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

})

test('should not login non-existent user', async () => {

    await request(app).post('/users/login').send({
        email: 'userOne.email',
        password: userOne.password
    }).expect(400)

})
