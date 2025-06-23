// models/ServiceProviderUser.js
const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
    {
        // Basic signup info
        fullName: { type: String, maxLength: 100, required: true },
        email: { type: String, maxLength: 80, required: true, unique: true },
        phone: { type: String, maxLength: 20, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        country: { type: String, maxLength: 60, required: true },
        address: { type: String, maxLength: 500, required: true },
        location: {
            longitude: { type: Number },
            latitude: { type: Number },
        },

        // Additional profile info
        businessName: { type: String, maxLength: 100 },
        bio: { type: String, maxLength: 250 }, // NEW FIELD: short personal intro
        profileDescription: { type: String, maxLength: 500 }, // detailed business profile
        dob: { type: String, maxLength: 100, default: "" },
        website: { type: String, maxLength: 120 },
        profilePicUrl: {
            type: String,
            maxLength: 250,
            default: "https://cdn-icons-png.flaticon.com/512/9308/9308008.png",
        },

        // Services offered (one-to-many)
        services: [
            {
                category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category", // Reference to Category schema
                    required: true,
                },
                subCategory: { type: String, maxLength: 100 },
                description: { type: String, maxLength: 500 },
                price: { type: Number, required: true },
            },
        ],

        // Ratings by customers
        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
                rating: { type: Number, min: 1, max: 5 },
                review: { type: String, maxLength: 500 },
                serviceName: { type: String, maxLength: 150 },
            },
        ],

        // Admin field
        accountStatus: { type: String, default: "approved" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ServiceProviderUser", providerSchema);
