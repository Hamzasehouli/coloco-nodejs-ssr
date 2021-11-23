const catchAsync = require('./../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    rating: req.body.rating,
    review: req.body.review,
    reviewdUser: req.params.userId,
    user: req.user.id,
  });
  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const review = await Review.findById(id);
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { updatedReview },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const id = req.params.reviewId;
  await Review.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    message: 'the Review is deleted',
  });
});
