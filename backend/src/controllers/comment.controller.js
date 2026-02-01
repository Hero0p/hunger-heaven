const commentModel = require('../models/comment.model');
const foodModel = require('../models/food.model');

async function createComment(req, res) {
    try {
        const { foodId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = await commentModel.create({
            food: foodId,
            user: userId,
            text
        });

        // Optionally populate user to return consistent response
        // await comment.populate('user', 'name'); 

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getCommentsByFoodId(req, res) {
    try {
        const { foodId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await commentModel.find({ food: foodId })
            .populate('user', 'fullName') // Assuming user model has fullName
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Comments retrieved successfully",
            comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createComment,
    getCommentsByFoodId
};
