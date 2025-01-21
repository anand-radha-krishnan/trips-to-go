const express = require('express');

const { protectRoute, restrictTo } = require('../controllers/authController');

const {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  aliasTopTrips,
  getTripStats,
  getMonthlyPlan,
} = require('../controllers/tripController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tripId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTrips, getAllTrips);

router.route('/trip-stats').get(getTripStats);

router
  .route('/monthly-plan/:year')
  .get(restrictTo('admin', 'guide', 'lead-guide'), getMonthlyPlan);

router
  .route('/')
  .get(getAllTrips)
  .post(protectRoute, restrictTo('admin', 'lead-guide'), createTrip);

router
  .route('/:id')
  .get(getTrip)
  .patch(protectRoute, restrictTo('admin', 'lead-guide'), updateTrip)
  .delete(protectRoute, restrictTo('admin', 'lead-guide'), deleteTrip);

module.exports = router;
