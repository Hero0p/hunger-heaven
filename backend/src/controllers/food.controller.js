const foodModel = require("../models/food.model");

async function createFood(req , res){
    console.log(req.body);
    console.log(req.file);
    res.send("item created");

}

module.exports = {createFood};