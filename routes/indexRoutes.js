const express = require("express");
const router = express.Router();

//User Route
const userRoutes = require("./userRoute");
router.use("/v1/user", userRoutes);
