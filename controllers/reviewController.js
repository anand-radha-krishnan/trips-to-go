const Reviews = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTripuserIds = (req, res, next) => {
  // Nested route
  if (!req.body.trip) req.body.trip = req.params.tripId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Reviews);
exports.getReview = factory.getOne(Reviews);
exports.createNewReview = factory.createOne(Reviews);
exports.deleteReview = factory.deleteOne(Reviews);
exports.updateReview = factory.updateOne(Reviews);
