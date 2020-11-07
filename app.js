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
const BusinessReviewRouter = require('@routes/business/business-review.route')
const DropdownRouter = require('@routes/common/dropdown.route')
const MediaRouter = require('@routes/application/media.route')
const HomeSliderRouter = require('@routes/application/home-slider.route')
const PersonRouter = require('@routes/application/person.route')
const PricingPackageRouter = require('@routes/application/pricing-package.route')
const EventRouter = require('@routes/event/event.route')
const NewsRouter = require('@routes/news/news.route')
const FileRouter = require('@routes/application/file.route')
const OpeningHourRouter = require('@routes/application/opening-hours.route.js')
const UtilRouter = require('@routes/application/util.route.js')
const UIRouter = require('@routes/application/ui.route.js')
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
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/category', CategoryRouter)
app.use('/business', BusinessRouter)
app.use('/business-review', BusinessReviewRouter)
app.use('/dropdown', DropdownRouter)
app.use('/media', MediaRouter)
app.use('/home-slider', HomeSliderRouter)
app.use('/contact-person', PersonRouter)
app.use('/pricing-package', PricingPackageRouter)
app.use('/event', EventRouter)
app.use('/news', NewsRouter)
app.use('/file', FileRouter)
app.use('/opening-hours', OpeningHourRouter)
app.use('/util', UtilRouter)
app.use('/ui', UIRouter)
// #endregion

module.exports = app
