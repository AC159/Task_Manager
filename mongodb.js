const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {

    if (error) {
        return console.log('Unable to connect to db...')
    }

    const db = client.db(databaseName) // Create db or connect to it

    // db.collection('Users').findOne({name: 'AC'}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch user...')
    //     }
    //     console.log(user)
    // })

    db.collection('Users').find({age: 20}).toArray((error, users) => {
        console.log(users)
    })

    db.collection('Users').find({age: 20}).count((error, count) => {
        console.log(count)
    })

})
