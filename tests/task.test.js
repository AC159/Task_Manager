const request = require('supertest')
const Task = require('../src/models/task.js')
const app = require('../app.js')
const { taskOne,
    taskTwo,
    taskThree,
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    setupDatabase } = require('./fixtures/db.js')


beforeEach(setupDatabase)


test('should create task for user', async () => {

    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Finish this node.js course'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

})


test("should get all user's tasks", async () => {

    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)

})


test("should not delete another user's task", async () => {

    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    // Assert the task is still there by fetching it:
    const task = await  Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


