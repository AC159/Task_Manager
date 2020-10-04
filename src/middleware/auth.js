const jwt = require('jsonwebtoken')
const User = require('..\\models\\user.js')

const auth = async function (req, res, next) {

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')

        // Find a user by _id & check if they have the token in their token's array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        // Store the user inside the request to avoid querying for that same user again in the route handler:
        req.token = token  // Insert the specific token of the user's session
        req.user = user
        next() // Continue to route handler

    }catch(error){
        res.status(401).send({error: 'Please authenticate'})
    }

}

module.exports = auth