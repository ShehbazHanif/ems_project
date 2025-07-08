const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    maxLength: 120,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  minBudget: {
    type: Number,
    required: true,
  },
  maxBudget: {
    type: Number,
    required: true,
  },
  preferredDate: {
    type: Date,
  },
  refImg: {
    type: String
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed", "cancelled"],
    default: "open",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Job", jobSchema);
