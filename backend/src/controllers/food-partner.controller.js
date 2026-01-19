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
    // console.log(foodItemsByFoodPartner);
    const total = foodItemsByFoodPartner.length;
    const totalMeals = foodItemsByFoodPartner.length;

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner,
            totalMeals,
            customersServed,
        }

    });
}


module.exports = {
    getFoodPartnerById
};