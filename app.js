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
  next(error);
  //res.render('page-not-found', { error });
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.status === 404) {
    console.log('404 error: Page Not Found');
    res.status(404).render('page-not-found', { title: 'Page Not Found'});
  } else {
    console.log("500 error: Server error");
    err.status = err.status || 500;
    res.status(err.status).render('error', { title: 'Server Error'});
  }
});

module.exports = app;
