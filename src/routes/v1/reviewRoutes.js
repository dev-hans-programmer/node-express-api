const express = require('express');
const {
  createReview,
  getReviews,
} = require('../../controllers/reviewController');
const { protect } = require('../../controllers/authController');

const router = express.Router();

router.route('/').post(protect, createReview).get(getReviews);

module.exports = router;
