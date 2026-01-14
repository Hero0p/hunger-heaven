const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// user auth API
router.post("/user/register" , authController.registerUser);
router.post("/user/login" , authController.loginUser);
router.get("/user/logout" , authController.logoutUser);
// router.get("/test", (req, res) => {
//   console.log(req.body)
//   console.log(req.cookies);
//   res.json(req.cookies);
// });

// food partner auth API 

router.post("/food-partner/register" , authController.resgisterPartner);
router.post("/food-partner/login" , authController.loginPartner);
router.get("/food-partner/logout" , authController.logoutPartner);




module.exports = router;