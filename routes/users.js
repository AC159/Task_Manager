const express = require('express');
const router = express.Router();
const User = require('..\\src\\models\\user.js')
require('..\\src\\db\\mongoose.js')


/* GET users listing. */

router.post('/', async function (req, res) {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  }catch (error) {
    res.status(400).send(error)
  }

})

// Fetch all users
router.get('/', async function (req, res) {

  try{
    const users = await User.find({}) // The empty object specifies no search criteria so it is going to fetch them all
    res.send(users)
  }catch(error){
    res.status(500).send()
  }

})

// Fetch one user
router.get('/:id', async function (req, res) {

  const id = req.params.id

  try {
    const user = await User.findById(id) // Search the user object by id

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)

  }catch (error){
    res.status(500).send()
  }

})

// Update user information
router.patch('/:id', async (req, res) => {

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {
    const id = req.params.id

    const user = await User.findById(id)

    updates.forEach((update) => {
      user[update] = req.body[update]
    })

    await user.save()

    if (!user){
      return res.status(404).send()
    }

    res.send(user)

  }catch(error){
    res.status(400).send(error)
  }

})

router.delete('/:id', async (req, res) => {

  try {

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user){
      return res.status(404).send()
    }

    res.send(user)

  }catch(error){
    res.status(500).send(error)
  }

})

module.exports = router;
