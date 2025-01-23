const express = require('express');
const {
  getOverview,
  getTrip,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTrips,
} = require('../controllers/viewsController');
const { isLoggedIn, protectRoute } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/trips/:name', isLoggedIn, getTrip);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protectRoute, getAccount);
router.get('/my-bookings', protectRoute, getMyTrips);

router.post('/submit-user-data', protectRoute, updateUserData);

module.exports = router;
