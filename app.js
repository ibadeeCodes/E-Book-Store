const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const dbconfig = require('./config/db')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const MemoryStore = require('session-memory-store')(session)

require('./models/User')
require('./config/passport')(passport)


// Passport middleware
app.use(session({ 
    resave: true,
    secret: 'anything',
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())

// Public assets
app.use(express.static(path.join(__dirname, 'public')))

//Global vars
app.use((req, res,next) => {
    res.locals.user = req.user || null;
    next()
})

//Cookie-parser middleware
app.use(cookieParser())

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

mongoose.Promise = global.Promise

// Configuring database
dbconfig()

//Getting routes
const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})


// Using Routes
app.use('/auth', auth)
app.use('/', index)
app.use('/stories', stories)