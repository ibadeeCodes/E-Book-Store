const express = require('express')
const mongoose = require('mongoose')
const keys = require('./keys')

const connectDB = async () => {
    
    try {

        const connect = await mongoose.connect(keys.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        console.log(`connected to MongoDB at ${connect.connection.host}`)
    }
     
    catch(err) {
        console.log(err)
    }
}

module.exports = connectDB