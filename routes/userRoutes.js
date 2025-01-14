const express = require('express');

const {
  getAllUsers,
  getUser,
  createNewUser,
} = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(createNewUser);

router.route('/:id').get(getUser);

module.exports = router;
