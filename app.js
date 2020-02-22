const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const dbconfig = require('./config/db')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const moment = require('moment')
var methodOverride = require('method-override')
const MemoryStore = require('session-memory-store')(session)

//Require Models
require('./models/User')
require('./models/Story')

// handlebars helpers
const {truncate, 
stripTags,
formatDate,
select,
editIcon} = require('./helpers/hbs') 

//Initialize passport
require('./config/passport')(passport)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Passport middleware
app.use(session({ 
    resave: true,
    secret: 'anything',
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())

// Moment midleware
moment().format();

//Flash messages middleware
app.use(flash())

// Public assets
app.use(express.static(path.join(__dirname, 'public')))

//Global vars
app.use((req, res,next) => {
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Cookie-parser middleware
app.use(cookieParser())

// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

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