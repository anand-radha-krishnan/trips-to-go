const express = require('express');

const {
  getAllUsers,
  getUser,
  createNewUser,
  deleteUser,
  updateUser,
  getMe,
} = require('../controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
  restrictTo,
} = require('../controllers/authController');

const { updateMe, deleteMe } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// all routes after here is Auth protected
router.use(protectRoute);

router.patch('/update-password', updatePassword);

router.get('/get-me', getMe, getUser);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// all routes after here can be done only by admins
router.use(restrictTo('admin'));

router.delete('/delete-user/:id', deleteUser);
router.patch('/update-user/:id', updateUser);

router.route('/').get(getAllUsers).post(createNewUser);
router.route('/:id').get(getUser);

module.exports = router;
