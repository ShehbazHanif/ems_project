const mongoose = require('mongoose');

const authCustomerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // optional: to prevent duplicate emails
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true // set to true if it's mandatory
    },
    country: {
        type: String,
        required: true // set to true if needed
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'], // restrict values to common options
        required: true
    },
    address: {
        type: String,
        maxLength: 300,
    },
    location: {
        longitude: { type: Number },
        latitude: { type: Number },
    },
});

const Customer = mongoose.model('Customer', authCustomerSchema);

module.exports = Customer;
