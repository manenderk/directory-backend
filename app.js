// #region Packages Import
// eslint-disable-next-line no-unused-vars
const moduleAlias = require('module-alias/register')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
require('dotenv').config()
require('./config/passport.config')
const { handleError } = require('./utils/errors')
// #endregion

// #region Router Imports
const indexRouter = require('@routes/index')
// #endregion

// #region Express Configuration

const app = express()
app.use(logger('dev'))
app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, Origin, Accept',
  preflightContinue: false,
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
// #endregion

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(process.env.MONGO_CONN, {dbName: process.env.MONGO_DB})
  .then(() => console.log('Connected to database'))
  .catch(error => {
    console.log('Database connection error')
    console.log(error)
  })

// mongoose.set('debug', true)

app.use(passport.initialize())

// #region Routes
app.use('', indexRouter)

// #endregion

app.use(function (err, req, res, next) {
  handleError(err, res)
})

module.exports = app
