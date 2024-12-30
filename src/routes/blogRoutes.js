const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is healthy!",
  });
});

router.get("/print", (req, res) => {
  res.send("THIS IS PRINTING");
});

module.exports = { blogRoutes: router };
