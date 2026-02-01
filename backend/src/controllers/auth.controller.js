// const userModel = require("../models/user.model");
// const foodPartnerModel = require("../models/foodpartner.model")
// const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
// const { default: mongoose } = require("mongoose");
// const storageService = require("../services/storage.service");
// const { v4: uuid } = require("uuid");
// // const foodPartnerModel = require("../models/foodpartner.model");


// const cookieOptions = {
//     httpOnly: true,
//     sameSite: "lax",   // REQUIRED
//     secure: false,    // MUST be false on localhost
//     path: "/"
// };

// async function registerUser(req, res) {
//     const { fullName, email, password } = req.body;
//     const userExist = await userModel.findOne(
//         { email }
//     )
//     if (userExist) {
//         return res.status(400).json({ message: "email already exists" });
//     }
//     const hasedPass = await bcrypt.hash(password, 10);

//     const user = await userModel.create(
//         {
//             fullName,
//             email,
//             password: hasedPass
//         }
//     )

//     const token = jwt.sign({
//         id: user._id
//     }, process.env.JWT_SECRET);

//     res.cookie("token", token, cookieOptions);

//     res.status(201).json({
//         message: "user registered successfullyy",
//         user: {
//             _id: user._id,
//             email: user.email,
//             fullName: user.fullName
//         }
//     })
// }

// async function loginUser(req, res) {
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email });

//     if (!user) return res.status(400).json({ message: "user not found" });

//     const isPassValid = await bcrypt.compare(password, user.password);
//     if (!isPassValid) return res.status(400).json({ message: "invalid username or password" });

//     const token = jwt.sign({
//         id: user._id
//     }, process.env.JWT_SECRET);

//     res.cookie("token", token, cookieOptions);

//     res.status(200).json({
//         message: "user logged in successfully",
//         user: {
//             id: user._id,
//             name: user.fullName,
//             email: user.email
//         }
//     })
// }

// function logoutUser(req, res) {
//     res.clearCookie("token");
//     res.status(200).json({ message: "logged out succesfully" });

// }

// async function registerPartner(req, res) {
//     try {
//         const { name, email, password, phone, address, contactName } = req.body
//         const partnerExist = await foodPartnerModel.findOne({ email })
//         if (partnerExist) return res.status(400).json({ message: "accouont already exists" });

//         let imageUrl = "";
//         if (req.file) {
//             const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
//             imageUrl = fileUploadResult.url;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const foodPartner = await foodPartnerModel.create({
//             name,
//             contactName,
//             phone,
//             address,
//             email,
//             password: hashedPassword,
//             image: imageUrl
//         })

//         const token = jwt.sign({
//             id: foodPartner._id,
//         }, process.env.JWT_SECRET)

//         res.cookie("token", token)

//         return res.status(201).json({
//             message: "registeration successfull",
//             foodPartner: {
//                 id: foodPartner._id,
//                 name: foodPartner.name,
//                 email: foodPartner.email,
//                 phone: foodPartner.phone,
//                 address: foodPartner.address,
//                 contactName: foodPartner.contactName

//             }
//         })
//     } catch (error) {
//         console.error("Register Partner Error:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// }

// async function loginPartner(req, res) {
//     const { email, password } = req.body;

//     const foodPartner = await foodPartnerModel.findOne({ email });
//     if (!foodPartner) return res.status(400).json({ message: "invalid email" });
//     const isPassValid = await bcrypt.compare(password, foodPartner.password);
//     if (!isPassValid) {
//         return res.status(401).json({ message: "invalid email or password" });
//     }

//     const token = jwt.sign({
//         id: foodPartner._id
//     }, process.env.JWT_SECRET);

//     res.cookie("token", token);

//     return res.status(200).json({
//         message: "login successful",
//         partner: {
//             id: foodPartner._id,
//             name: foodPartner.name,
//             email: foodPartner.email,
//             phone: foodPartner.phone,
//             address: foodPartner.address,
//             contactName: foodPartner.contactName
//         }
//     })
// }


// function logoutPartner(req, res) {
//     res.clearCookie("token");
//     res.status(200).json({ message: "logged out succesfully" });
// }

// async function getCurrentUser(req, res) {
//     const user = req.user;
//     if (!user) return res.status(401).json({ message: "Not authenticated" });
//     return res.status(200).json({
//         user: {
//             id: user._id,
//             name: user.fullName,
//             email: user.email
//         }
//     });
// }




// module.exports = { registerUser, loginUser, logoutUser, registerPartner, loginPartner, logoutPartner, getCurrentUser };

const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

// -------------------------------
// COOKIE CONFIG (ONE SOURCE OF TRUTH)
// -------------------------------
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,                 // true on Render (HTTPS)
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,       // 7 days
};

// -------------------------------
// USER AUTH
// -------------------------------
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPass,
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        console.error("Register User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function logoutUser(req, res) {
    res.clearCookie("token", {
        path: "/",
        sameSite: isProduction ? "None" : "Lax",
        secure: isProduction,
    });

    return res.status(200).json({ message: "Logged out successfully" });
}

// -------------------------------
// FOOD PARTNER AUTH
// -------------------------------
async function registerPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        const partnerExist = await foodPartnerModel.findOne({ email });
        if (partnerExist) {
            return res.status(400).json({ message: "Account already exists" });
        }

        let imageUrl = "";
        if (req.file) {
            const uploadResult = await storageService.uploadFile(
                req.file.buffer,
                uuid()
            );
            imageUrl = uploadResult.url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            contactName,
            phone,
            address,
            email,
            password: hashedPassword,
            image: imageUrl,
        });

        const token = jwt.sign(
            { id: foodPartner._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            message: "Partner registered successfully",
            partner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
            },
        });
    } catch (error) {
        console.error("Register Partner Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginPartner(req, res) {
    try {
        const { email, password } = req.body;

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPassValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: foodPartner._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Partner login successful",
            partner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
            },
        });
    } catch (error) {
        console.error("Login Partner Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function logoutPartner(req, res) {
    res.clearCookie("token", {
        path: "/",
        sameSite: isProduction ? "None" : "Lax",
        secure: isProduction,
    });

    return res.status(200).json({ message: "Logged out successfully" });
}

// -------------------------------
// CURRENT USER
// -------------------------------
async function getCurrentUser(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({
        user: {
            id: user._id,
            name: user.fullName,
            email: user.email,
        },
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerPartner,
    loginPartner,
    logoutPartner,
    getCurrentUser,
};
