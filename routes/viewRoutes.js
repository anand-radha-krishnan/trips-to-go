const express = require('express');
const {
  getOverview,
  getTrip,
  getLoginForm,
  getAccount,
  updateUserData,
} = require('../controllers/viewsController');
const { isLoggedIn, protectRoute } = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/trips/:name', isLoggedIn, getTrip);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protectRoute, getAccount);

router.post('/submit-user-data', protectRoute, updateUserData);

module.exports = router;
