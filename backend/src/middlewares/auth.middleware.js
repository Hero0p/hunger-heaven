const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// The frontend (Vercel) and API (Render) are on different sites, so browsers that block
// third-party cookies never send the httpOnly cookie. The frontend therefore also sends the
// token as "Authorization: Bearer <token>"; prefer that, fall back to the cookie.
function getToken(req) {
    const header = req.headers.authorization || "";
    if (header.startsWith("Bearer ")) return header.slice(7);
    return req.cookies.token;
}

async function authFoodPartnerMiddleware(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "unauthorized access" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: "unauthorized access - please login as a food partner" });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        return res.status(401).json({ message: "unauthorized access" });
    }
}

async function authUserMiddleware(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "unauthorized access please login first" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "unauthorized access - user not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log("Auth Middleware - Verification Error:", err.message);
        return res.status(401).json({ message: "unauthorized access" });
    }
}

// For public pages: attach req.user when a valid user token is present, otherwise continue anonymously
async function optionalUserMiddleware(req, res, next) {
    const token = getToken(req);
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id);
        } catch (err) {
            // Invalid or expired token: treat as a guest
        }
    }
    next();
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware, optionalUserMiddleware };
