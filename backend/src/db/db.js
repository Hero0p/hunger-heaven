const mongoose = require('mongoose');

function connectDb(){
    mongoose.connect('mongodb://localhost:27017/hunger-heaven')
    .then(() => {
        console.log("databse connected");
    }).catch((e) => {
        console.log("db connection error : ", e);
    })
}

module.exports = connectDb;