const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const CookieSession = require('cookie-session')
const keys = require('./config/keys')

require('./models/User')
require('./services/passport')


mongoose.connect(keys.mongoURI)
const app = express()

app.use(CookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]

}))

app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)

const PORT = process.env.PORT || 5000
app.listen(PORT) //http://localhost:5000