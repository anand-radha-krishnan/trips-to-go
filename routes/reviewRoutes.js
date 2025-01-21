const express = require('express');

const {
  getAllReviews,
  createNewReview,
  deleteReview,
  updateReview,
  setTripuserIds,
  getReview,
} = require('../controllers/reviewController');
const { protectRoute, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protectRoute);
router
  .route('/')
  .get(getAllReviews)
  .post(protectRoute, restrictTo('user'), setTripuserIds, createNewReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'amdin'), updateReview)
  .delete(restrictTo('user', 'amdin'), deleteReview);

module.exports = router;
