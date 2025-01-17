const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (data, ...allowedFields) => {
  const newObj = {};
  Object.keys(data).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = data[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messsage: 'not yet defined',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messsage: 'not yet defined',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user tries to update password

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        400,
        'Cannot update password here. please use /update-password route',
      ),
    );

  // update user doc
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});
