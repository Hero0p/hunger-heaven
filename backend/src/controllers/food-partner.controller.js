const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const { getEngagement } = require("../utils/index");

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })
    const customersServed = getEngagement(foodPartnerId);

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    // Separate Reels (have video) vs Menu Items (no video or empty)
    // Note: Old data might have video required so 'reels' might overlap unless we strictly check content.
    // Logic: If video is present and string length > 0, it's a Reel. Else Menu.

    const reels = foodItemsByFoodPartner.filter(item => item.video && item.video.trim() !== "");
    const menuItems = foodItemsByFoodPartner.filter(item => !item.video || item.video.trim() === "");

    const totalMeals = foodItemsByFoodPartner.length;

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            // foodItems: foodItemsByFoodPartner, // Replaced by separated lists
            reels,
            menuItems,
            totalMeals,
            customersServed,
        }

    });
}


module.exports = {
    getFoodPartnerById
};