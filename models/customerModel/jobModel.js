const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
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
  budget: {
    type: Number,
    required: true,
  },
  preferredDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed", "cancelled"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Job", jobSchema);
