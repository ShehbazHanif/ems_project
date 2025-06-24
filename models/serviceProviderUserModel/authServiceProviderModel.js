const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  country: { type: String, required: true },
  address: {
    addname: { type: String, maxLength: 500 },
    longitude: { type: Number, default: 50 },
    latitude: { type: Number, default: 50 },
  },
  businessName: { type: String },
  bio: { type: String, maxLength: 250 },
  profileDescription: { type: String, maxLength: 500 },
  dob: { type: String },
  website: { type: String },
  profilePicUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9308/9308008.png",
  },
  accountStatus: { type: String, default: "approved" },
}, {
  timestamps: true
});

module.exports = mongoose.model("ServiceProviderUser", providerSchema);
