const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const tripRouter = require('./routes/tripRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const errorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// global middleware
// set security http request
app.use(helmet({ contentSecurityPolicy: false }));

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

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

app.use(compression());

// test middlewaare
app.use((req, res, next) => {
  next();
});

// Routes
app.use('/', viewRouter);

// API routes
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
