const mongoose = require('mongoose');

const serviceProviderUserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // optional but recommended
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required:true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    businessName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
});

const ServiceProviderUser = mongoose.model('ServiceProviderUser', serviceProviderUserSchema);

module.exports = ServiceProviderUser;
