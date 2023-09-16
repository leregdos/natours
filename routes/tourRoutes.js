const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);

tourRouter
  .route('/top-5-cheap')
  .get(tourController.topFiveCheap, tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.addNewTour);
// .post(tourController.checkBody, tourController.addNewTour); // CAN BE USED TO CHECK LOGIN STATUS
tourRouter
  .route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRouter;
