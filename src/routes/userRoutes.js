const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const prisma = new PrismaClient();

    const user = prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });

    if (user == null) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "user found",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user != null) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });

    return res.status(200).json({
      message: "user created successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = { userRoutes: router };
