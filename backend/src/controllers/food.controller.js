const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    // console.log(req.body);
    // console.log(req.file);
    // console.log(req.files);

    let videoUrl = "";
    if (req.files && req.files.video) {
        const videoUploadResult = await storageService.uploadFile(req.files.video[0].buffer, uuid());
        videoUrl = videoUploadResult.url;
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
        const imageUploadResult = await storageService.uploadFile(req.files.image[0].buffer, uuid());
        imageUrl = imageUploadResult.url;
    }

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: videoUrl,
        image: imageUrl,
        foodPartner: req.foodPartner._id
    })


    return res.status(201).json({ message: "food created successfully", food: foodItem });

}

async function getFoodItems(req, res) {
    try {
        const mongoose = require('mongoose');
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const foodItems = await foodModel.aggregate([
            {
                $match: {
                    video: { $exists: true, $ne: "" }
                }
            },
            {
                $lookup: {
                    from: 'foodpartners',
                    localField: 'foodPartner',
                    foreignField: '_id',
                    as: 'foodPartner'
                }
            },
            {
                $unwind: '$foodPartner'
            },
            // Lookup for User Like
            {
                $lookup: {
                    from: 'likes',
                    let: { foodId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$food', '$$foodId'] },
                                        { $eq: ['$user', userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userLike'
                }
            },
            // Lookup for User Save
            {
                $lookup: {
                    from: 'saves', // Assuming collection name is 'saves' from save.model.js
                    let: { foodId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$food', '$$foodId'] },
                                        { $eq: ['$user', userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userSave'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'food',
                    as: 'comments'
                }
            },
            {
                $addFields: {
                    commentCount: { $size: '$comments' },
                    isLiked: { $gt: [{ $size: '$userLike' }, 0] },
                    isSaved: { $gt: [{ $size: '$userSave' }, 0] }
                }
            },
            {
                $project: {
                    comments: 0,
                    userLike: 0,
                    userSave: 0,
                    'foodPartner.password': 0,
                    'foodPartner.email': 0
                }
            }
        ]);

        return res.status(200).json({ message: "food items listed successfully", foodItems });
    } catch (error) {
        console.error("Error fetching food items:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}



async function createMenu(req, res) {
    try {
        let foods = req.body.foods; // Expecting parsing by middleware or client sends 'foods' key

        // If simple body parsing didn't yield array (e.g. multipart/form-data complexity), 
        // Logic depends on how client sends data. 
        // For this task, we assume client sends JSON string in a field 'foods' or proper array handling.

        // Simple fallback if foods is string (JSON stringified)
        if (typeof foods === 'string') {
            try {
                foods = JSON.parse(foods);
            } catch (e) {
                // ignore
            }
        }

        if (!foods || !Array.isArray(foods)) {
            return res.status(400).json({ message: "Invalid data format. Send 'foods' array." });
        }

        // Files are in req.files (array) due to upload.any()
        // We match files by matching index in fieldname "foods[i][image]"? 
        // OR the client sends generic filenames? 
        // Let's assume the user prompt example implies a structured JSON, but for file upload, 
        // standard is structured field names.

        const validFoods = [];

        for (let i = 0; i < foods.length; i++) {
            const foodData = foods[i];

            // Try to find file for this index. 
            // e.g. fieldname: "foods[0][image]"
            // We search liberally.

            let imageUrl = "";

            if (req.files) {
                // Check if any file matches "foods[i][image]" or similar
                const file = req.files.find(f => f.fieldname === `foods[${i}][image]` || f.fieldname === `image_${i}`);
                if (file) {
                    const imageUploadResult = await storageService.uploadFile(file.buffer, uuid());
                    imageUrl = imageUploadResult.url;
                }
            }

            // Using image from body if URL provided, or uploaded file URL
            // If the user prompt said "image: <image-file>", it means file upload.

            validFoods.push({
                name: foodData.name,
                description: foodData.description,
                price: parseFloat(foodData.price),
                image: imageUrl,
                foodPartner: req.foodPartner._id,
                video: "", // Menu items don't have video
            });
        }

        const createdFoods = await foodModel.insertMany(validFoods);

        res.status(201).json({
            message: "Menu created successfully",
            foods: createdFoods
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    createMenu
}