const express = require('express');
const router = express.Router();
require('..\\src\\db\\mongoose.js')
const Task = require('..\\src\\models\\task.js')


/* GET home page. */


router.post('/', async function (req, res) {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }

})

// Fetch all tasks
router.get('/', async (req,res) => {

    try {
        const tasks = await Task.find({}) // The empty object specifies no search criteria so it is going to fetch them all
        res.send(tasks)
    }catch(error){
        res.status(500).send()
    }

})

// Fetch one task
router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    }catch(error){
        res.status(500).send()
    }

})

// Update a task
router.patch('/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const id = req.params.id

        const task = await Task.findById(id)

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        if (!task){
            return res.status(404).send()
        }

        res.send(task)

    }catch(error){
        res.status(400).send(error)
    }

})

router.delete('/:id', async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task){
            return res.status(404).send()
        }

        res.send(task)

    }catch(error){
        res.status(500).send(error)
    }

})

module.exports = router;
