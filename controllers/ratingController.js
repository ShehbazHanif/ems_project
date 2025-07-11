const Review = require("../models/ratingModel");

const submitReview = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const reviewerId = req.user._id;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status !== "past") return res.status(400).json({ message: "Cannot review before completion." });

    let revieweeId;
    if (booking.customerId.toString() === reviewerId.toString()) {
      revieweeId = booking.providerId;
    } else if (booking.providerId.toString() === reviewerId.toString()) {
      revieweeId = booking.customerId;
    } else {
      return res.status(403).json({ message: "Unauthorized to review this booking." });
    }

    const existingReview = await Review.findOne({ bookingId, reviewerId });
    if (existingReview) return res.status(400).json({ message: "Review already submitted." });

    const review = await Review.create({
      bookingId,
      reviewerId,
      revieweeId,
      rating,
      comment
    });

    res.status(201).json({ message: "Review submitted successfully.", review });

  } catch (error) {
    console.error("Submit Review Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {submitReview};