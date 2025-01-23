const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // get all trip data
  const trips = await Trip.find();

  // build template
  // render
  res.status(200).render('overview', {
    title: 'All Trips',
    trips,
  });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const { name } = req.params;

  const trip = await Trip.findOne({ slug: name }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!trip) {
    return next(new AppError(400, 'Trip name not found'));
  }

  res.status(200).render('trip', {
    title: trip.name,
    trip,
  });
});

exports.getLoginForm = (req, res) => {
  // render
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  const newUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      enail: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: newUser,
  });
});
