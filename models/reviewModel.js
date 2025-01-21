const mongoose = require('mongoose');
const Trip = require('./tripModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review is required'],
      trim: true,
      maxLength: [400, 'Cannot be more than 400 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'A rating is required'],
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date.now() },
    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
      required: [true, 'A review must belong to a Trip'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a User'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

reviewSchema.index({ trip: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'trip',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name image',
  // });

  this.populate({
    path: 'user',
    select: 'name image',
  });
  next();
});

reviewSchema.statics.calAverageRating = async function (tripId) {
  const stats = await this.aggregate([
    {
      $match: { trip: tripId },
    },
    {
      $group: {
        _id: '$trip',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Trip.findByIdAndUpdate(tripId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calAverageRating(this.trip);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;
