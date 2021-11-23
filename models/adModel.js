const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'please give your ad a title'],
    },
    city: {
      type: String,
      required: [true, 'please enter in which city your ad is about'],
    },
    category: {
      type: String,
      requied: [true, 'please chose category of your ad'],
      enum: ['Flatshares', 'Houses', 'Flats', '1 Room Flats'],
      message: 'please chose only allowed categories',
    },
    adresse: String,
    rentType: {
      type: String,
      requied: [true, 'please chose type of the rent'],
      enum: ['long term', 'short term'],
      message: 'please chose only the allowed categories',
    },
    district: {
      type: String,
      required: true,
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
    availableFrom: {
      type: Date,
      required: [true, 'please enter when the rent is available'],
    },
    availableTo: {
      type: Date,
      required: [true, 'please enter when the rent will end'],
    },
    propertyType: {
      type: String,
      enum: [
        'old building',
        'renovated old building',
        'newly built house',
        'terraced house',
        'semi detached house',
        'detached house',
        'multi fmaily house',
        'multi storey house',
        'slab construction',
      ],
    },
    size: {
      type: Number,
      required: [true, 'please enter the size of the property'],
    },
    parking: {
      type: String,
      enum: [
        'many',
        'limited',
        'residential parking only',
        'private parking',
        'underground parking',
      ],
    },
    rentPerMonth: {
      type: Number,
      required: true,
    },
    utilityCosts: {
      type: Number,
    },
    deposit: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, 'please describe your property'],
    },
    iAm: {
      type: String,
      enum: ['the owner', 'the caretaker', 'the renter', 'other'],
      message: 'please enter your identity ',
    },
    imageCover: String,
    images: [String],
    // location: {
    //   type: {
    //     type: String,
    //     enum: ['Point'],
    //     default: 'Point',
    //     required: true,
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //   },
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
adSchema.index({ location: '2dsphere' });
adSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'userName email firstName photo',
  });
  next();
});

adSchema.index({ size: 1, rentPerMonth: -1 });

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
