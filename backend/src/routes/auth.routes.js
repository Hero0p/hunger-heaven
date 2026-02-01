const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// user auth API
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
const authMiddleware = require('../middlewares/auth.middleware');
router.get("/user/me", authMiddleware.authUserMiddleware, authController.getCurrentUser);
// router.get("/test", (req, res) => {
//   console.log(req.body)
//   console.log(req.cookies);
//   res.json(req.cookies);
// });

// food partner auth API 
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
})

router.post("/food-partner/register", upload.single("image"), authController.registerPartner);
router.post("/food-partner/login", authController.loginPartner);
router.get("/food-partner/logout", authController.logoutPartner);




module.exports = router;