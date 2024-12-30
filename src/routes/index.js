const express = require("express");
const router = express.Router();

const { blogRoutes } = require("./blogRoutes");
const { userRoutes } = require("./userRoutes");

router.use("/user", userRoutes);
router.use("/blog", blogRoutes);

module.exports = { appRouter: router };
