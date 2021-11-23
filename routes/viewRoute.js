const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/', viewController.overview);
router.get('/createAd', authController.protect, viewController.createAd);
router.get('/forgetPassword', viewController.forgetPassword);
router.get('/resetPassword/:token', viewController.resetPassword);
router.get('/signup', viewController.signup);
router.get('/login', viewController.login);
router.get('/ads', viewController.getAds);
router.get('/deleteMe', authController.protect, viewController.deleteMe);
router.get('/myProfile', authController.protect, viewController.myProfile);
router.get('/ad/:id', viewController.addedAd);
router.get('/myads', authController.protect, viewController.myAds);

module.exports = router;
