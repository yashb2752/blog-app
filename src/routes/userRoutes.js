const express = require("express");
const router = express.Router();
router.get("/login", (req, res) => {
  res.status(200).json({
    messa: "user login",
  });
});

router.get("/signup", (req, res) => {
  res.send("user signup");
});
module.exports = { userRoutes: router };
