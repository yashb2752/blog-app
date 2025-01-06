const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user == null) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const passwordFromDB = user.password;
    console.log(passwordFromDB, password, {
      truth: await bcrypt.compare(password, passwordFromDB),
    });

    if (!(await bcrypt.compare(password, passwordFromDB))) {
      return res.status(400).json({
        message: "wrong password",
      });
    }

    const accessToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      message: "user found",
      data: { user: user, accessToken: accessToken },
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
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

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.body.user;
    return res.send(user);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/");

module.exports = { userRoutes: router };
