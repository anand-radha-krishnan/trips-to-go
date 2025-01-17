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

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTrips, getAllTrips);

router.route('/trip-stats').get(getTripStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/');

router.route('/').get(protectRoute, getAllTrips).post(createTrip);

router
  .route('/:id')
  .get(getTrip)
  .patch(updateTrip)
  .delete(protectRoute, restrictTo('admin', 'lead-guide'), deleteTrip);

module.exports = router;
