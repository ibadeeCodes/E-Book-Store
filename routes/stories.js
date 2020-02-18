const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


router.get('/show', (req,res) => {
    res.send('show')
})

router.get('/add', (req,res) => {
    res.send('add')
})

router.get('/edit', (req,res) => {
    res.send('edit')
})

router.get('/index', (req,res) => {
    res.send('index')
})


module.exports = router