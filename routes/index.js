const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', (req, res) => {
    res.render('index/home')
})

router.get('/dashboard', (req,res) => {
    res.render('index/dashboard')
})


module.exports = router
