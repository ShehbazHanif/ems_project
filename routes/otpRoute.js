const express = require('express');
const otpRoute = express.Router();
const { createOtp, verifyOtp, resendOtp, resetPassword } = require("../controllers/otpController")
otpRoute.post('/createOtp', createOtp);
otpRoute.post('/verifyOtp', verifyOtp);
otpRoute.post('/resendOtp', resendOtp)
otpRoute.post('/resetPassword', resetPassword)
module.exports = otpRoute;