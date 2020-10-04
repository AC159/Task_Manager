const express = require('express');
const router = express.Router();
require('..\\src\\db\\mongoose.js')
const Task = require('..\\src\\models\\task.js')
const auth = require('..\\src\\middleware\\auth.js')


/* GET home page. */


router.post('/', auth, async function (req, res) {

    // Create a new task and its association to a user:
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }

})

// Fetch all tasks
router.get('/', auth, async (req,res) => {

    try {

        const tasks = await Task.find({ owner: req.user._id })

        res.send(tasks)
    }catch(error){
        res.status(500).send()
    }

})

// Fetch one task
router.get('/:id', auth, async (req, res) => {
    const id = req.params.id

    try {

        const task = await Task.findOne({ _id: id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    }catch(error){
        res.status(500).send()
    }

})

// Update a task
router.patch('/:id', auth, async (req, res) => {

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
        const task = await Task.findOne( { _id: id, owner: req.user._id })

        if (!task){
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)

    }catch(error){
        res.status(400).send(error)
    }

})

router.delete('/:id', auth, async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

        if (!task){
            return res.status(404).send()
        }

        res.send(task)

    }catch(error){
        res.status(500).send(error)
    }

})

module.exports = router;
