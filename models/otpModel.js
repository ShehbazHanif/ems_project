const mongoose = require('mongoose');

const createOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'  // <- dynamic reference
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Customer', 'ServiceProviderUser']  // <- only allow these two models
  },
  email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

  otp: {
    type: String,
    required: true
  },
  isUsed: {
        type: Boolean,
        default: false
    },
  expiresAt: {
    type: Date,
    required: true
  }
});

const Otp = mongoose.model('Otp', createOtpSchema);

module.exports = Otp;
