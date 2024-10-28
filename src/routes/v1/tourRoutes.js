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

const router = express.Router();

// param middleware
router.param('id', (req, res, next, id) => {
  logger.info(`Tour with ID: ${id}`);
  next();
});

router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
