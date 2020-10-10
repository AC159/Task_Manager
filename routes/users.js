const express = require('express');
const router = express.Router();
const User = require('..\\src\\models\\user.js')
require('..\\src\\db\\mongoose.js')
const auth = require('..\\src\\middleware\\auth.js')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('..\\src\\emails\\account.js')


const upload = multer({
  limits: {
    fileSize: 1000000 // File size can be 1 megabytes maximum
  },
  fileFilter(req, file, cb) {  // fileFilter is a function

    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a .jpg/.jpeg/.png image!'))
    }
    cb(undefined, true)  // Proceed with the route handler
  }

})


/* GET users listing. */

// Create a new user
router.post('/', async function (req, res) {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
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
    email = req.user.email
    name = req.user.name
    await req.user.remove()
    sendCancellationEmail(email, name)
    res.send(req.user)

  }catch(error){
    res.status(500).send(error)
  }

})

// Upload files with form-data instead of a json body
router.post('/me/avatar', auth, upload.single('avatar'), async function(req, res) {

  req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

  await req.user.save()
  res.send()

}, function (error, req, res, next) {
  res.status(400).send({ error: error.message })
})

// Delete user avatar
router.delete('/me/avatar', auth, async function(req, res){

  req.user.avatar = undefined
  await req.user.save()
  res.send()

})

// Fetch an avatar
router.get('/:id/avatar', async function(req, res) {

  try{

    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)

  }catch(error){
    res.status(404).send()
  }

})

module.exports = router;
