const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const Ad = require('./../models/adModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Features = require('./../utils/features');

exports.getAllAds = catchAsync(async (req, res, next) => {
  const features = new Features(req.query);
  features.filter().sort().fields().paginate();
  const ads = await features.query;
  res.status(200).json({
    status: 'success',
    results: ads.length,
    data: { ads },
  });
});
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadImage = upload.single('photo');
const upload2 = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploading = upload2.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  { name: 'images-1', maxCount: 1 },
  { name: 'images-2', maxCount: 1 },
  { name: 'images-3', maxCount: 1 },
]);
exports.resizeImages = catchAsync(async (req, res, next) => {
  const vals = Object.values(req.files);

  vals.forEach(async (fs, i) => {
    fs[0].filename =
      i === 0
        ? `ad-${req.user.id}-${Date.now()}-${Math.floor(
            Math.random() * 2000000
          )}-imageCover.jpeg`
        : `ad-${req.user.id}-${Date.now()}-${Math.floor(
            Math.random() * 2000000
          )}-image-${i}.jpeg`;
    await sharp(fs[0].buffer)
      .resize(2000, 1300)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${fs[0].filename}`);
  });
  next();
});

exports.resize = catchAsync(async (req, res, next) => {
  req.file.filename = `ad-${Math.floor(
    Math.random() * 20000
  )}-${Date.now()}-image.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 90 })
    .toFormat('jpeg')
    .toFile(`public/img/users/${req.file.filename}`);
  res.status(200).json({
    status: 'success',
    data: req.file.filename,
  });
});

exports.sendImageToFs = catchAsync(async (req, res, next) => {});

exports.createAd = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const vals = Object.values(req.files);
  let imageCover = '';
  let images = [];
  vals.forEach((v, i) => {
    if (i === 0) imageCover = v[0].filename;
    else {
      images.push(v[0].filename);
    }
  });

  const ad = await Ad.create({
    deposit: req.body.deposit,
    adresse: req.body.adresse,
    title: req.body.title,
    city: req.body.city,
    category: req.body.category,
    rentType: req.body.rentType,
    district: req.body.district,
    houseNumber: req.body.houseNumber,
    postalCode: req.body.postalCode,
    availableFrom: req.body.availableFrom,
    availableTo: req.body.availableTo,
    floorLevel: req.body.floorLevel,
    size: req.body.size,
    rentPerMonth: req.body.rentPerMonth,
    utilityCosts: req.body.utilityCosts,
    iAm: req.body.iAm,
    description: req.body.description,
    location: req.body.location,
    user: req.user.id,
    telephone: req.body.telephone,
    identity: req.body.identity,
    imageCover,
    images,
  });
  res.status(201).json({
    status: 'success',
    data: { ad },
  });
});

exports.getAd = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const ad = await Ad.findById(id);
  res.status(200).json({
    status: 'success',
    data: { ad },
  });
});

exports.updateAd = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { updatedAd },
  });
});

exports.deleteAd = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Ad.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    message: 'the ad is deleted',
  });
});

exports.geoQuery = catchAsync(async (req, res, next) => {
  const { distance, unit, lnglat } = req.params;
  const [lng, lat] = lnglat.split(',');

  const radiansDistance = unit === 'mi' ? distance / 3959 : distance / 6371;

  const ads = await Ad.find({
    location: {
      $geoWithin: {
        $centerSphere: [[+lng, +lat], radiansDistance],
      },
    },
  });
  res.status(200).json({
    status: 'success',
    results: ads.length,
    data: { ads },
  });
});
