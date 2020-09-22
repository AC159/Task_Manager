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

    db.collection('Users').deleteMany({
        age: 99
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})
