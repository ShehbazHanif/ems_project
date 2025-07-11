const Booking = require('../common/bookingModel');

const completeBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    // Only customer or provider can mark it complete
    if (
      booking.customerId.toString() !== userId.toString() &&
      booking.providerId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to complete this booking." });
    }

    if (booking.status !== "ongoing") {
      return res.status(400).json({ message: "Only ongoing bookings can be completed." });
    }

    booking.status = "past";
    await booking.save();

    res.status(200).json({ message: "Booking marked as complete.", booking });
  } catch (error) {
    console.error("Complete Booking Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    if (
      booking.customerId.toString() !== userId.toString() &&
      booking.providerId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking." });
    }

    if (booking.status !== "ongoing") {
      return res.status(400).json({ message: "Only ongoing bookings can be cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully.", booking });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {completeBooking,cancelBooking};
