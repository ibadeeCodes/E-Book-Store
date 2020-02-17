const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')

require('./config/passport')(passport)

//Getting routes
const auth = require('./routes/auth')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})

app.get('/', (req,res) => {
    res.send('home')
})

// Using Routes
app.use('/auth', auth)