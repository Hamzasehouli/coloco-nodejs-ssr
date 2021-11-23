const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Ad = require('./../models/adModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError('please confirm the password', 400));
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    title: req.body.title,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const token = await jwt.sign({ id: newUser.id }, process.env.MY_SECRET_KEY, {
    expiresIn: '7d',
  });
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  await sendEmail({
    from: 'hamza sehouli <sehouli.hamza@gmail.com>',
    to: `${req.body.email}`,
    subject: `welcome ${req.body.userName} to coloco family`,
    text:
      'we are very happy to be our new member, if you ae any question, feel free to ask us',
  });
  res.status(201).json({
    status: 'success',
    token,
    data: { newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(
      new AppError('please enter your valid email and password to log in', 400)
    );
  const user = await User.findOne({
    email: req.body.email,
  }).select('+password');
  if (!user)
    return next(
      new AppError('the user no longer exists or the password is wrong', 400)
    );

  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (correctPassword === false)
    return next(
      new AppError('the user no longer exists or the password is wrong', 400)
    );

  const token = await jwt.sign({ id: user.id }, process.env.MY_SECRET_KEY, {
    expiresIn: '7d',
  });
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new AppError('please enter your email', 400));
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('no user found', 404));
  const token = await jwt.sign({ id: user.id }, process.env.MY_SECRET_KEY, {
    expiresIn: `${10 * 60 * 1000}`,
  });
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;
  const urlTemplate = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${token}`;
  await sendEmail({
    from: 'hamza sehouli <sehouli.hamza@gmail.com>',
    to: `${user.email}`,
    subject: `click on the link (10 min) to reset your password`,
    text: urlTemplate,
  });
  res.status(201).json({
    status: 'success',
    message: 'email is sent, please check your inbox',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const rawToken = req.params.token;
  const decoded = await jwt.verify(rawToken, process.env.MY_SECRET_KEY);

  if (decoded.exp < Date.now() / 1000)
    return next(new AppError('the link is expired, please try again', 403));

  if (!req.body.password || !req.body.passwordConfirm) {
    return next('please provide a password and confirm it', 400);
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new AppError('password and password confirm are not the same', 400)
    );
  }

  const user = await User.findByIdAndUpdate(
    decoded.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    { new: true, validateBeforeSave: true }
  );

  const token = await jwt.sign({ id: user.id }, process.env.MY_SECRET_KEY, {
    expiresIn: `7d`,
  });
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
    message: 'password is successfully reset',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('please use other route to update your password'));
  const id = req.user.id;

  if (req.file) {
    req.body.photo = req.file.filename;
  } else {
    req.body.photo = req.user.photo;
  }

  await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('hi-a-a-a-a-a-');
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(new AppError('please login to perform this task', 403));

  const decoded = await jwt.verify(token, process.env.MY_SECRET_KEY);

  if (decoded.exp < Date.now() / 1000)
    return next(new AppError('login session has expired', 400));
  const currentUser = await User.findById(decoded.id).select('+password');

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('you are not allowed to perform this task'));
    next();
  });

exports.deleteMe = catchAsync(async (req, res, next) => {
  if (!req.body.password)
    return next(
      new AppError(
        'please enter your current password to delete your account',
        403
      )
    );

  const correctPassword = await bcrypt.compare(
    req.body.password,
    req.user.password
  );

  if (correctPassword === false)
    return next(
      new AppError('the user no longer exists or the password is wrong', 400)
    );
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  const token = 'öavlimo5wcztnox7zt837nzc782x8otm3h8x3it2t53o9x8mzuco3x4';
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 60000),
    httpOnly: true,
  });
  await sendEmail({
    from: 'hamza sehouli <sehouli.hamza@gmail.com>',
    to: `${req.user.email}`,
    subject: `your account is deactivated`,
    text:
      'we are sad that your are about to leave us, feel free to join us whenever you want',
  });
  res.status(200).json({
    status: 'success',
    token,
    message: 'your account is deactivated',
  });
});

exports.ifTheAdIsMine = catchAsync(async (req, res, next) => {
  const adId = req.params.id;
  const ad = await Ad.findById(adId);
  if (!ad) return next(new AppError('no ad found', 400));
  if (req.user.id !== ad.user.id)
    return next(new AppError('you can only update your ad', 403));
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) return next();
    const token = req.cookies.jwt;

    if (!token) return next();

    const decoded = await jwt.verify(token, process.env.MY_SECRET_KEY);
    if (!decoded) return next();
    if (decoded.exp < Date.now() / 1000) return next();
    const currentUser = await User.findById(decoded.id).select('+password');

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.locals.user = false;
    next();
  }
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.currentPassword)
    return next(new AppError('please enter your current password', 400));
  if (!req.body.password || !req.body.passwordConfirm)
    return next(new AppError('please enter new password and confirm it', 400));
  const id = req.user.id;

  const correctPassword = await bcrypt.compare(
    req.body.currentPassword,
    req.user.password
  );

  if (correctPassword === false)
    return next(
      new AppError('the user no longer exists or the password is wrong', 400)
    );

  if (req.body.password !== req.body.passwordConfirm)
    return next(
      new AppError('password and password confirm are not the same', 403)
    );
  const encryptedPssword = await bcrypt.hash(req.body.password, 12);

  await User.findByIdAndUpdate(
    id,
    {
      password: encryptedPssword,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const token = 'öavlimo5wcztnox7zt837nzc782x8otm3h8x3it2t53o9x8mzuco3x4';
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
});
