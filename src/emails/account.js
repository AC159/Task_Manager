const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'anacap100@gmail.com',
        subject: 'Welcome to the app',
        text: `Welcome to the app ${name}! Let me know how you get along with the app.`
    }

    sgMail.send(msg)
        .then(function () {
            console.log('Message sent...')
        })
        .catch(function (error){
            console.log(error)
        })
}

const sendCancellationEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'anacap100@gmail.com',
        subject: 'We are sorry to see you go',
        text: `We are sorry to see you go ${name}! Was there any way to improve the app?`
    }

    sgMail.send(msg)
        .then(function () {
            console.log('Message sent...')
        })
        .catch(function (error){
            console.log(error)
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}