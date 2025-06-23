require("dotenv").config();
const ServiceProviderUser = require("../../models/serviceProviderUserModel/serviceProviderUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// REGISTER CONTROLLER
// ==========================
const handleServiceProviderUserRegister = async (req, res) => {
    const {
        fullName,
        email,
        password,
        phone,
        country,
        gender,
        businessName,
        address,
        bio,
        profileDescription,
        dob,
        website,
        longitude,
        latitude,
    } = req.body;

    try {
        // ✅ Check if user already exists
        const existingUser = await ServiceProviderUser.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user with location object
        const user = await ServiceProviderUser.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            country,
            gender,
            businessName,
            address,
            bio,
            profileDescription,
            dob,
            website,
            location: {
                longitude,
                latitude,
            },
        });

        // ✅ Response
        res.status(200).json({
            ok: true,
            success: true,
            message: "User created successfully",
            user: `User Name: ${user.fullName}, Email: ${user.email}`,
        });

    } catch (error) {
        console.error("❌ Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};


// ==========================
// LOGIN CONTROLLER
// ==========================
const handleLoginServiceProviderUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ✅ Find user
        const user = await ServiceProviderUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        // ✅ Generate token
        const tokenExpiration = process.env.EXPIRE_DAY || "1d";
        const accessToken = jwt.sign(
            {
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                },
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: tokenExpiration }
        );

        // ✅ Set cookie options
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict", // Optional security enhancement
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        };

        // ✅ Response
        res.status(201)
            .cookie("accessToken", accessToken, options)
            .json({
                accessToken,
                userId: user._id,
                message: "Login successfully",
                success: true,
            });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    handleServiceProviderUserRegister,
    handleLoginServiceProviderUser,
};
