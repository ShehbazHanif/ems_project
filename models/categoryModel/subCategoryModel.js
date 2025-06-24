const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
