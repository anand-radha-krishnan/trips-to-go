const express = require('express');

const {
  getAllUsers,
  getUser,
  createNewUser,
} = require('../controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
} = require('../controllers/authController');

const { updateMe, deleteMe } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-password', protectRoute, updatePassword);

router.patch('/update-me', protectRoute, updateMe);
router.delete('/delete-me', protectRoute, deleteMe);

router.route('/').get(getAllUsers).post(createNewUser);

router.route('/:id').get(getUser);

module.exports = router;
