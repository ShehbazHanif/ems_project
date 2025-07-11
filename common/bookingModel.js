const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProviderUser", required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["ongoing", "past", "cancelled"],
    default: "ongoing"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
