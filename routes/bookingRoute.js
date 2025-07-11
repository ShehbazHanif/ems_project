const express = require('express');
const bookingRouter = express.Router();
const {authenticateToken} = require('../middlewares/auth');
const{completeBooking, cancelBooking}= require('../controllers/bookingController')

bookingRouter.use(authenticateToken)

bookingRouter.patch('/complete',completeBooking);
bookingRouter.patch('/cancel',cancelBooking);

module.exports = bookingRouter;