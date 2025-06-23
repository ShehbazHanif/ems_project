// controllers/otpController.js
const otpModel = require('../../models/otpModel/otpModel');
const Customer = require('../../models/customerModel/customerModel');
const ServiceProviderUser = require('../../models/serviceProviderUserModel/serviceProviderUserModel');
const sendMail = require('../../services/mailService');
const bcrypt = require('bcryptjs');

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

const findUserByEmail = async (email) => {
    let user = await Customer.findOne({ email: email.toLowerCase() });
    if (!user) {
        user = await ServiceProviderUser.findOne({ email: email.toLowerCase() });
    }
    return user;
};

const createOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address"
            });
        }

        const userId = user._id;
        const userName = user.name || 'User';

        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

        await otpModel.deleteMany({ userId, isUsed: false });

        // Determine the user model type
        let userModelName = null;
        if (user instanceof Customer) {
            userModelName = 'Customer';
        } else if (user instanceof ServiceProviderUser) {
            userModelName = 'ServiceProviderUser';
        }

        const otpRecord = await otpModel.create({
            userId,
            userModel: userModelName,
            email: email.toLowerCase(),
            otp: generatedOtp,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
        });

        const msg = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Hello, ${userName}!</h2>
                <p style="color: #555; font-size: 16px;">You have requested to reset your password. Your verification code is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <h1 style="color: #007bff; font-size: 36px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; letter-spacing: 5px;">${generatedOtp}</h1>
                </div>
                <p style="color: #555;">Please enter this code to proceed with password reset.</p>
                <p style="color: #dc3545; font-size: 14px; font-weight: bold;">⏰ This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #6c757d; font-size: 12px;">🔒 If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
                <p style="color: #6c757d; font-size: 12px;">For security reasons, this code can only be used once.</p>
            </div>
        `;

        const emailResult = await sendMail(email.toLowerCase(), "Password Reset - Verification Code", msg);
        const emailSent = emailResult.accepted && emailResult.accepted.includes(email.toLowerCase());

        if (emailSent) {
            return res.status(201).json({
                success: true,
                message: "OTP sent successfully. Please check your email.",
                data: {
                    email: email.toLowerCase(),
                    expiresIn: `${OTP_EXPIRY_MINUTES} minutes`,
                    maxAttempts: MAX_ATTEMPTS,
                    otpId: otpRecord._id
                }
            });
        } else {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again later."
            });
        }
    } catch (error) {
        console.error("Error in createOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating OTP."
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await otpModel.findOne({
            email: email.toLowerCase(),
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Please request a new one."
            });
        }

        if (otpRecord.attempts >= MAX_ATTEMPTS) {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.status(400).json({
                success: false,
                message: "Maximum verification attempts exceeded. Please request a new OTP."
            });
        }

        if (new Date() > otpRecord.expiresAt) {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        otpRecord.attempts += 1;
        await otpRecord.save();

        if (otpRecord.otp === otp.toString()) {
            return res.status(200).json({
                success: true,
                message: "OTP verified successfully.",
                data: {
                    userId: otpRecord.userId,
                    email: otpRecord.email,
                    verified: true,
                    resetToken: `${otpRecord.userId}_${Date.now()}`
                }
            });
        } else {
            const remainingAttempts = MAX_ATTEMPTS - otpRecord.attempts;
            return res.status(400).json({
                success: false,
                message: `Invalid OTP. You have ${remainingAttempts} attempt(s) remaining.`
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while verifying OTP"
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address"
            });
        }

        const recentOtp = await otpModel.findOne({
            userId: user._id,
            createdAt: { $gte: new Date(Date.now() - 60000) }
        });

        if (recentOtp) {
            const timeLeft = Math.ceil((60000 - (Date.now() - recentOtp.createdAt)) / 1000);
            return res.status(429).json({
                success: false,
                message: `Please wait ${timeLeft} seconds before requesting another OTP.`
            });
        }

        return createOtp(req, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while resending OTP"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find valid and unused OTP
        const otpRecord = await otpModel.findOne({
            email: email.toLowerCase(),
            otp: otp,
            userId: user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        if (user instanceof Customer) {
            await Customer.findByIdAndUpdate(user._id, { password: hashedPassword });
        } else {
            await ServiceProviderUser.findByIdAndUpdate(user._id, { password: hashedPassword });
        }

        // Mark OTP as used and delete all related OTPs
        otpRecord.isUsed = true;
        await otpRecord.save();
        await otpModel.deleteMany({ userId: user._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while resetting password"
        });
    }
};


module.exports = {
    createOtp,
    verifyOtp,
    resendOtp,
    resetPassword
};
