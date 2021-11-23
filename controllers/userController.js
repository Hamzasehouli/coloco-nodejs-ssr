const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const multerStrorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please only upload images', 400), false);
  }
};

const upload = multer({
  storage: multerStrorage,
  fileFilter: multerFilter,
});

exports.resizeImage = catchAsync(async (req, res, next) => {
  console.log(req.body, 'resize');
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}-profile-photo.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500, {
      fit: 'cover',
      position: 'center',
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

exports.uploadPhoto = upload.single('photo');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id).populate('ads gotReviewedBy myReviews');
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    message: 'the user is deleted',
  });
});
