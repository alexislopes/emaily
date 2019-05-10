const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const CookieSession = require('cookie-session')
const keys = require('./config/keys')
const bodyParser = require('body-parser')

require('./models/User')
require('./services/passport')

// connection to mongoDB
mongoose.connect(keys.mongoURI)

// express app creation
const app = express()

// setting a middleware that reads json
app.use(bodyParser.json())

// cookie configs
app.use(CookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]

}))

// passport needs
app.use(passport.initialize())
app.use(passport.session())

// routing imports
require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)

// production settings
if(process.env.NODE_ENV === 'production'){
    // Express will serve up production assets
    // like our main.js file, or main.css file
    app.use(express.static('client/build'))

    // Express will serve up the index.html file
    // if it does not recognize the route
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}

const PORT = process.env.PORT || 5000
app.listen(PORT) //http://localhost:5000