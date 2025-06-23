const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
