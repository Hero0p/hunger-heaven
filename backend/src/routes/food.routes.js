const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const foodController = require('../controllers/food.controller');
const multer = require('multer');

const upload = multer({
    storage : multer.memoryStorage(),
})

//post for foodpartner
router.post('/' , authMiddleware.authFoodPartnerMiddleware , upload.single("video") ,foodController.createFood);
// get for users
router.get('/' , authMiddleware.authUserMiddleware , foodController.getFoodItems);


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)

router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)

module.exports = router