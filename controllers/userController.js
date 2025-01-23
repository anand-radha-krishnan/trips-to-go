const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError(400, 'Please upload only an image'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserImage = upload.single('image');

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (data, ...allowedFields) => {
  const newObj = {};
  Object.keys(data).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = data[el];
  });
  return newObj;
};

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messsage: 'Please use signup instead',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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

  if (req.file) filteredBody.image = req.file.filename;
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

// only for admins
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
