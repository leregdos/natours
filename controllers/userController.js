const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  for (let field of allowedFields) {
    if (Object.keys(obj).includes(field)) newObj[field] = obj[field];
  }
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // create an error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  // update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // send response
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  if (!user) {
    return next(new AppError('User could not be found', 404));
  }
  res.status(204).json({
    status: 'success',
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not yet implemented',
    },
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not yet implemented',
    },
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not yet implemented',
    },
  });
};
