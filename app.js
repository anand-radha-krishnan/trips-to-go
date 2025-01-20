const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const tripRouter = require('./routes/tripRoutes');
const userRouter = require('./routes/userRoutes');
const errorHandler = require('./controllers/errorController');

const app = express();

// global middleware
// set security http request
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from the IP, please try again later',
});
app.use('/api', limiter);

// request body parser, data from body to req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

// data sanitization against NOSQL query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middlewaare
app.use((req, res, next) => {
  next();
});

app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
