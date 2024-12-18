const express = require('express');
const {
  createReview,
  getReviews,
} = require('../../controllers/reviewController');
const { protect, restrictTo } = require('../../controllers/authController');
const { AppRoles } = require('../../utils/common');

const router = express.Router({ mergeParams: true }); // This option is needed to merge param from different router

router
  .route('/')
  .post(protect, restrictTo(AppRoles.USER), createReview)
  .get(getReviews);

module.exports = router;
