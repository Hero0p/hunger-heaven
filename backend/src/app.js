const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");

app.use(express.json());
app.use(cookieParser());

app.get("/" , (req , res) => {
    res.send("hello")
})

app.use("/api/auth/", authRoutes);
app.use("/api/food" , foodRoutes);

module.exports = app;