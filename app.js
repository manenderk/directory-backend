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
// #endregion

// #region Router Imports
const indexRouter = require('@routes/index')
const usersRouter = require('@routes/user/users.route')
const CategoryRouter = require('@routes/category/category.route')
const BusinessRouter = require('@routes/business/business.route')
const BusinessImageRouter = require('@routes/business/business-image.route')
const BusinessReviewRouter = require('@routes/business/business-review.route')
const MenuCategoryRouter = require('@routes/restaurant/menu-category.route')
const MenuItemRouter = require('@routes/restaurant/menu-item.route')
const MenuItemReviewRouter = require('@routes/restaurant/menu-item-review.route')
const DropdownRouter = require('@routes/common/dropdown.route')
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

mongoose.connect('mongodb://127.0.0.1:27017/theDirectoryDb')
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Database connection error'))
/* mongoose.connect('mongodb+srv://clusteruser:Zx8eHnhzG2vENf1k@app-cluster-t6cjp.mongodb.net/TheDirectory?retryWrites=true&w=majority')
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Database connection error')) */

// #region Routes
app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/category', CategoryRouter)
app.use('/api/businesses', BusinessRouter)
app.use('/api/business-images', BusinessImageRouter)
app.use('/api/business-review', BusinessReviewRouter)
app.use('/api/menu-categories', MenuCategoryRouter)
app.use('/api/menu-items', MenuItemRouter)
app.use('/api/menu-item-reviews', MenuItemReviewRouter)
app.use('/api/dropdown', DropdownRouter)
// #endregion

module.exports = app
