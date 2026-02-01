const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const discoverRoutes = require("./routes/discover.routes");
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/auth/", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/search", require("./routes/search.routes"));


module.exports = app;