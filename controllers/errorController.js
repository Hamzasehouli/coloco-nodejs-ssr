const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'developement') {
    if (req.originalUrl.includes('api')) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res.status(err.statusCode).json({
        status: err.status,
        stack: err.stack,
        err,
        message: err.message,
      });
    }
    if (err.message.includes('login')) {
      return res.status(err.statusCode).render('loginOrSignup', {
        err: 'login or signup if you do not have an account',
        title: 'please login to perform this task',
      });
    }
    res.status(err.statusCode).render('error', {
      err: err.message,
    });
  }
  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      if (err.kind.indcludes('ObjectId'))
        return next(new AppError('the ad does not exist'));
      res.status(err.statusCode).json({
        status: err.status,
        stack: err.stack,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong',
      });
    }
  }
  next();
};

module.exports = globalErrorHandler;
