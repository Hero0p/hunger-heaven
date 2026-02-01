const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "unauthorized access" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        return res.status(401).json({ message: "unauthorized access" });
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    console.log("Auth Middleware - Token:", token ? "Present" : "Missing");
    if (!token) return res.status(401).json({ message: "unauthorized access please login first" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Auth Middleware - Decoded ID:", decoded.id);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            console.log("Auth Middleware - User not found in DB");
            return res.status(401).json({ message: "unauthorized access - user not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log("Auth Middleware - Verification Error:", err.message);
        return res.status(401).json({ message: "unauthorized access" });
    }
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware };