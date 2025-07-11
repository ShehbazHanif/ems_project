const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    default: null // will be used when provider sends an offer
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    default: null // will be used when customer sends an offer
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProviderUser",
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  proposal: {
    type: String,
    maxLength: 1000
  },
  portfolioUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
