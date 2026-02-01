const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const foodController = require('../controllers/food.controller');
const commentController = require('../controllers/comment.controller');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})

//post for foodpartner
router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.fields([{ name: "video", maxCount: 1 }, { name: "image", maxCount: 1 }]), foodController.createFood);

router.post('/menu', authMiddleware.authFoodPartnerMiddleware, upload.any(), foodController.createMenu);

// get for users
router.get('/', authMiddleware.authUserMiddleware, foodController.getFoodItems);


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

router.post('/:foodId/comment', authMiddleware.authUserMiddleware, commentController.createComment);
router.get('/:foodId/comments', commentController.getCommentsByFoodId);

module.exports = router