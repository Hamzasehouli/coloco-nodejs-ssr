const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      minLength: 8,
    },
    email: {
      unique: true,
      type: String,
      require: [true, 'please add a valid email'],
      // validate: {
      //   validator: function () {
      //     if (!this.email.includes('@') || !this.email.includes('.')) {
      //       return false;
      //     }
      //   },
      //   message: 'email invalid',
      // },
    },
    password: {
      type: String,
      required: [true, 'please provide a passwrod'],
      select: false,
    },
    photo: {
      type: String,
      default: 'user.jpg',
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
    },
    profileCreatedAt: {
      type: Date,
      default: Date.now(),
    },
    title: {
      type: String,
      enum: ['Mr', 'Ms/Mrs', 'Not Specified'],
      message: 'only Mr, Ms/Mrs or not specified are accepted',
      required: [true, 'Please enter your title'],
    },
    firstName: {
      type: String,
      maxLnegth: 20,
      minLength: 3,
      required: [true, 'Please enter your first name'],
    },
    lastName: {
      type: String,
      maxLnegth: 20,
      required: [true, 'Please enter your last name'],
    },
    telephonNumber: {
      unique: true,
      type: String,
      max: 10,
      min: 10,
    },
    mobileNumber: {
      type: String,
      unique: true,
      max: 10,
      min: 10,
    },
    street: {
      type: String,
    },
    houseNumber: {
      type: Number,
    },
    postalCode: {
      type: Number,
    },
    city: {
      type: String,
    },
    youCurrentlyLiveIn: {
      type: String,
      enum: ['other', 'a flat share', 'an appartment'],
    },
    language: {
      type: String,
      enum: ['arabic', 'french', 'english'],
    },
    occupationalStatus: {
      type: String,

      enum: [
        'unemployed',
        'high school student',
        'university student',
        'freelance',
        'self employed',
        'house wife/husband',
        'apprentice',
        'employee',
        'official',
      ],
    },
    facebookLink: String,
    profileImage: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    role: {
      type: String,
      default: 'user',
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 10,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', async function (next) {
  const encryptedPssword = await bcrypt.hash(this.password, 12);
  this.password = encryptedPssword;
  this.passwordConfirm = undefined;
  // this.save();
  next();
});

userSchema.virtual('ads', {
  ref: 'Ad',
  foreignField: 'user',
  localField: '_id',
});
userSchema.virtual('gotReviewedBy', {
  ref: 'Review',
  foreignField: 'reviewdUser',
  localField: '_id',
});
userSchema.virtual('myReviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
