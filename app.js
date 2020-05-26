//#region Packages Import
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
//#endregion

//#region Router Imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
//#endregion

//#region Express Configuration

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});
//#endregion

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://127.0.0.1:27017/theDirectoryDb')
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Database connection error'));



//#region Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//#endregion

module.exports = app;
