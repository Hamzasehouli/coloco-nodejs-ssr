const express = require('express');
const adController = require('./../controllers/adController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/distance/:distance/unit/:unit/center/:lnglat')
  .get(adController.geoQuery);
router
  .route('/')
  .get(adController.getAllAds)
  .post(
    authController.protect,
    adController.uploading,
    adController.resizeImages,
    adController.createAd
  );
router
  .route('/:id')
  .get(adController.getAd)
  .patch(
    authController.protect,
    authController.ifTheAdIsMine,
    adController.updateAd
  )
  .delete(
    authController.protect,
    authController.ifTheAdIsMine,
    adController.deleteAd
  );

module.exports = router;
