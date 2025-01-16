const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const tripRouter = require('./routes/tripRoutes');
const userRouter = require('./routes/userRoutes');
const errorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
