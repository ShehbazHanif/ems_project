const express = require("express");
const offerRouter = express.Router();
const {
  sendOffer,
  getAllOffers,
  acceptOffer,
  rejectOffer
} = require("../controllers/offerController");

const {authenticateToken} = require("../middlewares/auth"); // JWT middleware

// All routes require authentication
offerRouter.use(authenticateToken);

// ✅ Send an offer (either job or service)
offerRouter.post("/send", sendOffer);

// 📥 Get all offers related to logged-in user
offerRouter.get("/", getAllOffers);

// ✅ Accept an offer
offerRouter.patch("/accept/:offerId", acceptOffer);

// ❌ Reject an offer
offerRouter.patch("/reject/:offerId", rejectOffer);

module.exports = offerRouter;
