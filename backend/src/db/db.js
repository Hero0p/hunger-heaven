const mongoose = require('mongoose');

function connectDb() {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("databse connected");
        }).catch((e) => {
            console.log("db connection error : ", e);
        })
}

module.exports = connectDb;