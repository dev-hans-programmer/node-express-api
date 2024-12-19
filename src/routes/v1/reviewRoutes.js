const express = require('express');
const {
  createReview,
  getReviews,
  checkReviewCreateCriteria,
  getReview,
  updateReview,
  deleteReview,
} = require('../../controllers/reviewController');
const { protect, restrictTo } = require('../../controllers/authController');
const { AppRoles } = require('../../utils/common');

const router = express.Router({ mergeParams: true }); // This option is needed to merge param from different router

router.use(protect);

router
  .route('/')
  .get(getReviews)
  .post(restrictTo(AppRoles.USER), checkReviewCreateCriteria, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo(AppRoles.USER, AppRoles.ADMIN), updateReview)
  .delete(restrictTo(AppRoles.USER, AppRoles.ADMIN), deleteReview);

module.exports = router;
