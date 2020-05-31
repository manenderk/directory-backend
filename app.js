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
// #endregion

// #region Router Imports
const indexRouter = require('@routes/index')
const usersRouter = require('@routes/user/users.route')
const BusinessTypeRouter = require('@routes/business/business-type.route')
const BusinessRouter = require('@routes/business/business.route')
const BusinessImageRouter = require('@routes/business/business-image.route')
const MenuCategoryRouter = require('@routes/restaurant/menu-category.route')
const MenuItemRouter = require('@routes/restaurant/menu-item.route')
const MenuItemReviewRouter = require('@routes/restaurant/menu-item-review.route')
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
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  next()
})
// #endregion

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

mongoose.connect('mongodb://127.0.0.1:27017/theDirectoryDb')
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Database connection error'))

// #region Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/business-types', BusinessTypeRouter)
app.use('/businesses', BusinessRouter)
app.use('/business-images', BusinessImageRouter)
app.use('/menu-categories', MenuCategoryRouter)
app.use('/menu-items', MenuItemRouter)
app.use('/menu-item-reviews', MenuItemReviewRouter)
// #endregion

module.exports = app
