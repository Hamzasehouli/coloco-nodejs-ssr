const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Ad = require('./../models/adModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.getAds = catchAsync(async (req, res, next) => {
  const ads = await Ad.find();
  res.status(200).render('ads', {
    title: 'Ads',
    ads,
  });
});
exports.overview = catchAsync(async (req, res, next) => {
  res.status(200).render('overview', {
    title: 'Overview',
  });
});
exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Signup',
  });
});
exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});
exports.forgetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgetPassword', {
    title: 'Reset password',
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'Resetting password',
  });
});
exports.createAd = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('Please login to create Ad', 400));
  res.status(200).render('signup', {
    title: 'Create an ad',
  });
});
exports.myProfile = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('Please login ', 400));
  res.status(200).render('myProfile', {
    title: 'Settitngs',
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  res.status(200).render('deleteMe', {
    title: 'Delete my account',
  });
});

exports.createAd = catchAsync(async (req, res, next) => {
  res.status(200).render('createAd', {
    title: 'Crate an Ad',
  });
});
exports.addedAd = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const ad = await Ad.findById(id);

  const userOfAd = await User.findById(ad.user.id);
  console.log(ad, userOfAd);
  res.status(200).render('ad', {
    title: 'ad',
    ad,
    userOfAd,
  });
});
exports.myAds = catchAsync(async (req, res, next) => {
  const ads = await Ad.find({ user: req.user });
  console.log('----------------------');
  res.status(200).render('myAds', {
    title: 'ad',
    ads,
  });
});
