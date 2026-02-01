const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getDiscover(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const partners = await foodPartnerModel.aggregate([
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'foods',
                    localField: '_id',
                    foreignField: 'foodPartner',
                    as: 'foods'
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    address: 1,
                    totalFoodItems: { $size: '$foods' },
                    totalReels: {
                        $size: {
                            $filter: {
                                input: '$foods',
                                as: 'food',
                                cond: {
                                    $and: [
                                        { $ne: ['$$food.video', null] },
                                        { $ne: ['$$food.video', ""] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            message: "Restaurants discovered successfully",
            restaurants: partners
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getDiscover
};
