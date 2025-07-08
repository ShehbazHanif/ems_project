require("dotenv").config();
const Customer = require("../models/authCustomerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Customer
const handleCustomerRegister = async (req, res) => {
    const {
        fullName,
        email,
        password,
        phone,
        country,
        gender,
        address,
        longitude,
        latitude,
    } = req.body;

    try {
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already exists", success: false });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const customer = await Customer.create({
            fullName,
            email,
            password: hashPassword,
            phone,
            country,
            gender,
            address,
            location: {
                longitude,
                latitude,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            user: `Name: ${customer.fullName}, Email: ${customer.email}`,
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
};

// Login Customer
const handleLoginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ success: false, error: "Customer not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, customer.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                user: {
                    id: customer._id,
                    name: customer.fullname,
                    email: customer.email,
                },
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.EXPIRE_DAY || "1d" }
        );

        res
            .status(200)
            .cookie("accessToken", token, {
                httpOnly: true,
                secure: true,
            })
            .json({
                success: true,
                message: "Login successful",
                accessToken: token,
                userId: customer._id,
            });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

module.exports = { handleCustomerRegister, handleLoginCustomer };
