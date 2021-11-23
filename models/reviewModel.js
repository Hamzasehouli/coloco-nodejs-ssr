const mongoose = require('mongoose');
const User = require('./userModel');
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: true,
    },
    review: {
      type: String,
      maxLength: 200,
      required: true,
    },
    reviewedAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    reviewdUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^findOneAnd/, async function (next) {});

reviewSchema.statics.calcAvg = async function (reviewdUserId) {
  const stats = await this.aggregate([
    {
      $match: { reviewdUser: reviewdUserId },
    },
    {
      $group: {
        _id: '$reviewdUser',
        quant: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await User.findByIdAndUpdate(
    reviewdUserId,
    {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].quant,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

reviewSchema.post('save', async function () {
  this.constructor.calcAvg(this.reviewdUser);
});
reviewSchema.index({ reviewdUser: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^findOneAnd/, async function () {
  this.doc = await this.findOne();
});
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (this.doc) await this.doc.constructor.calcAvg(this.doc.reviewdUser._id);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate('user');
  this.populate('reviewdUser');
  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
