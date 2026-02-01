const foodModel = require('../models/food.model');
const foodPartnerModel = require('../models/foodpartner.model');

module.exports.search = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(200).json({ foods: [], restaurants: [] });
        }

        const query = q.trim();

        // Use regex for case-insensitive partial matching
        const regex = new RegExp(query, 'i');

        // Search Food Items (by name or description)
        // Ensure we only returning valid video content items if desired, but general search usually includes all.
        // The prompt says "Search Food Items".
        const foods = await foodModel.find({
            $or: [
                { name: regex },
                { description: regex }
            ]
        }).limit(20).populate('foodPartner', 'name image');

        // Search Food Partners (by name)
        const restaurants = await foodPartnerModel.find({
            name: regex
        }).limit(20).select('name image email address city');

        res.status(200).json({
            foods,
            restaurants
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Internal server error during search." });
    }
};
