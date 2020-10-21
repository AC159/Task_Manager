**Task App with Node.js & Express.js**

1) Create a config directory that contains the environment variables

2) Set the .env file with the following variables:

        PORT=3000
        SENDGRID_API_KEY=(get yours on sendgrid)
        MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api
        JWT_SECRET=<any string>
    
3) Create a test.env file that will contain the env. variables for Jest tests:

        PORT=3000
        SENDGRID_API_KEY= (get yours on sendgrid)
        MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api-test
        JWT_SECRET=<any string>