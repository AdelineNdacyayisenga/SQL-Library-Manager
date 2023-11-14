var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//database connection
const sequelize = require('./models').sequelize;//import sequelize
const Sequelize = require('sequelize');

//async function to test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful');
  } catch (error) {
    console.log('Error connecting to the database');
  }
})();

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //static files

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = "Sorry! We couldn't find the page you were looking for.";
  //next(createError(404));
  //next(error);
  res.render('page-not-found', { error });
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status !== 404) {
    err.status = 500;
    res.locals.message = "Server Error"
    res.render('error');
    console.log(err.status);
    console.log(err.message);
  } 
});

module.exports = app;
