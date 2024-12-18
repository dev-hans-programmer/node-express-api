const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require('../../controllers/tourController');
const { logger } = require('../../config/logger');
const { protect, restrictTo } = require('../../controllers/authController');
const { AppRoles } = require('../../utils/common');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// param middleware
router.param('id', (req, res, next, id) => {
  logger.info(`Tour with ID: ${id}`);
  next();
});

router.use('/:tourId/reviews', reviewRouter);

router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo(AppRoles.ADMIN, AppRoles.LEAD_GUIDE), deleteTour);

module.exports = router;
