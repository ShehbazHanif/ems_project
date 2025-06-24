const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 100,
  },
  type: {
    type: String,
    enum: ["job", "service"],
// supports both job and service usage
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);
