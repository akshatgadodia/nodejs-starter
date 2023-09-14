const express = require("express");
const router = express.Router();

//User Route
const userRoutes = require("./userRoutes");
router.use("/v1/user", userRoutes);

module.exports = router;
