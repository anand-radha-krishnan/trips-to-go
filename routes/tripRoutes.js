const express = require('express');

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

router.route('/').get(getAllTrips).post(createTrip);

router.route('/:id').get(getTrip).patch(updateTrip).delete(deleteTrip);

module.exports = router;
