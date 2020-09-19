const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {

    if(error){
        return console.log('Unable to connect to db...')
    }

    const db = client.db(databaseName) // Create db

    // db.collection('Users').insertOne({
    //     name: 'JC',
    //     age: 99
    // }, (error, result) => {
    //
    //     if (error){
    //         return console.log('Unable to insert user...')
    //     }
    //
    //     console.log(result.ops)
    //
    // })

    // db.collection('Tasks').insertMany([
    //     {
    //     description: "Finish Pen Testing Courses",
    //     completed: false
    //     },
    //     {
    //         description: "Learn Node.js",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error){
    //         return console.log('Unable to insert user...')
    //     }
    //
    //     console.log(result.ops)
    //
    // })

})
