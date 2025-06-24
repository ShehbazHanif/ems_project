const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProviderUser",
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
  description: {
    type: String,
    maxLength: 500,
  },
  price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Service", serviceSchema);
