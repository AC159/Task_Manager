const express = require('express');
const router = express.Router();
const User = require('..\\src\\models\\user.js')
require('..\\src\\db\\mongoose.js')
const auth = require('..\\src\\middleware\\auth.js')


/* GET users listing. */

// Create a new user
router.post('/', async function (req, res) {
  const user = new User(req.body)

  try {
    await user.save()

    const token = await user.GenerateAuthToken()

    res.status(201).send({ user, token })

  }catch (error) {
    res.status(400).send(error)
  }

})

// Login a user
router.post('/login', async function (req, res) {

  try{

    const user = await User.findByCredentials(req.body.email,req.body.password)

    const token = await user.GenerateAuthToken()

    res.send({ user: user, token: token })  // Send back the user & the token

  }catch(error){
    res.status(400).send()
  }

})

// Logout a user
router.post('/logout', auth, async function (req, res) {

    try{

      // Delete the token of this user's current session
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
      })

      await req.user.save()

      res.send()

    }catch(error){
      res.status(500).send()
    }

})

// Logout all sessions/tokens of this user
router.post('/logoutAll', auth, async function(req, res) {

  try{

    // Wipe the user's tokens array
    req.user.tokens = []
    await req.user.save()
    res.send()


  }catch(error){
    res.status(500).send()
  }

})


// Fetch user profile
// Run the 'auth' middleware before processing the requests/response
router.get('/me', auth, async function (req, res) {

  res.send(req.user)

})

// Update user information
router.patch('/me', auth, async (req, res) => {

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {

    updates.forEach((update) => {
      req.user[update] = req.body[update]
    })

    await req.user.save()
    res.send(req.user)

  }catch(error){
    res.status(400).send(error)
  }

})

router.delete('/me', auth, async (req, res) => {

  try {

    await req.user.remove()
    res.send(req.user)

  }catch(error){
    res.status(500).send(error)
  }

})

module.exports = router;
