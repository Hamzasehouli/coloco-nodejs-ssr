const express = require('express');
const pug = require('pug');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const globalErroRHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoute');
const viewRoute = require('./routes/viewRoute');
const adRoute = require('./routes/adRoute');
const reviewRoute = require('./routes/reviewRoute');
const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/ads', adRoute);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  next(new AppError('the route is not found on this server'));
});

app.use(globalErroRHandler);

module.exports = app;
