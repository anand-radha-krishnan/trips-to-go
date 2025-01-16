const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A trip must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Trip name must have less than 40 characters'],
      minLength: [10, 'Trip name must have more than 10 characters'],
      // validate: [validator.isAlpha, 'Name must contain only alphabets'],
    },
    duration: { type: Number, required: [true, 'A trip must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A trip must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A trip must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsQuantity: { type: Number, default: 0 },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating must be above 0'],
      max: [5, 'rating must be below 5'],
    },
    price: {
      type: Number,
      required: [true, 'A trip must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // only works on create a new document NOT on update
          return this.price > val;
        },
        message: 'Discount price should not be greater than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A trip must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A trip must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTrip: { type: Boolean, default: false },
    slug: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tripSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tripSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware
tripSchema.pre(/^find/, function (next) {
  this.find({ secretTrip: { $ne: true } });
  this.start = Date.now();
  next();
});

tripSchema.post(/^find/, function (docs, next) {
  console.log('took', Date.now() - this.start);

  next();
});

// Aggregation middleware
tripSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTrip: { $ne: true } } });

  next();
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
