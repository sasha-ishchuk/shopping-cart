const express = require('express'); //connect express
const path = require('path');

const mysql = require('mysql'); //connect db
const dotenv = require('dotenv');

const session = require("express-session");
const cookieParser = require('cookie-parser');

const flash = require('connect-flash');

dotenv.config({
  path: './.env'
})

const app = express(); //start server

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB
});

// SESSION
const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
  secret : process.env.S_SECRET,
  resave : false,
  cookie: { maxAge: oneDay },
  saveUninitialized : true
}));


// view engine 'ejs' setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// add static files to use by express
const publicDirectory = path.join(__dirname, 'public')
app.use(express.static(publicDirectory));

const imageDirectory = path.join(__dirname, 'images')
app.use(express.static(imageDirectory));

// parse URL-encoded bodies (as sent HTML-forms)
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(flash());

// parse JSON bodies (as sent by API clients)
app.use(express.json());

db.connect( (error) => {
  if(error) {
    console.log(error)
  }else {
    console.log("MySQL Connected...")
  }
})

// Define routes
const pagesRouter = require('./routes/pages');
app.use('/', pagesRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

const paymentRouter = require('./routes/payment');
app.use('/payment', paymentRouter);

app.listen(3000, () => {
  console.log("Server start on 3000")
})


// var createError = require('http-errors');

// var logger = require('morgan');

// app.use(logger('dev'));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
