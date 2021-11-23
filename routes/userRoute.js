const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const viewController = require('./../controllers/viewController');
const adController = require('./../controllers/adController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/logout').get(authController.logout);
router
  .route('/deleteMe')
  .delete(authController.protect, authController.deleteMe);
router
  .route('/updateMe')
  .patch(
    authController.protect,
    userController.uploadPhoto,
    userController.resizeImage,
    authController.updateMe
  );
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.use('/:userId/reviews', reviewRouter);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.post('/uploading', adController.uploadImage, adController.resize);
module.exports = router;
