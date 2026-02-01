const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        // required: true  // Made optional for menu items
    },
    image: {
        type: String,
        required: false
    },
    price: {
        type: Number, // Required for menu items
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    }
});

const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;