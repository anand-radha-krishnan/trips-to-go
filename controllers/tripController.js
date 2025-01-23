const multer = require('multer');
const sharp = require('sharp');

const Trip = require('../models/tripModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError(400, 'Please upload only an image'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadTripImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTripImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) next();

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (image, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

exports.aliasTopTrips = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTrips = factory.getAll(Trip);
exports.getTrip = factory.getOne(Trip, { path: 'reviews' });
exports.createTrip = factory.createOne(Trip);
exports.updateTrip = factory.updateOne(Trip);
exports.deleteTrip = factory.deleteOne(Trip);

exports.getTripStats = catchAsync(async (req, res, next) => {
  const stats = await Trip.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTrips: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Trip.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTrips: { $sum: 1 },
        trips: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numOfTrips: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

// /tours-within/:distance/center/:latlong/unit/:unit
// /tours-within/300/center/52.514043,13.407557/unit/km
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [latitude, longitude] = latlong.split(',');

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  if (!latitude || !longitude) {
    return next(new AppError(400, 'Please provide latitude and longitude'));
  }

  const trips = await Trip.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res
    .status(200)
    .json({ status: 'success', results: trips.length, data: { trips } });
});

exports.getDisctances = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;
  const [latitude, longitude] = latlong.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!latitude || !longitude) {
    return next(new AppError(400, 'Please provide latitude and longitude'));
  }

  const distances = await Trip.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+longitude, +latitude],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({ status: 'success', data: { distances } });
});
