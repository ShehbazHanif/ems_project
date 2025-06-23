require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization']; // Get the 'Authorization' header
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

        if (!token) {
            return res.status(401).json({ status: 401, message: "Auth token is required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.user) {
            return res.status(401).json({ status: 401, message: "Invalid token" });
        }

        req.user = decoded.user;
        // console.log("Authenticated user:", req.user);
        // console.log("Authenticated userID:", req.user.id);

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({ status: 403, message: "Forbidden: Invalid token" });
    }
}


module.exports = { authenticateToken};
