// models/Rating.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProviderUser" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, maxLength: 500 },
        serviceName: { type: String, maxLength: 150 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
