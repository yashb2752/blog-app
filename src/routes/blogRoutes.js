const { PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();

// req.headers.userid =
// req.body.title content

// /blog/all
// /blog/:blogId (delete, update, get)
// /blog/create (create)

router.get("/all", async (req, res) => {
  try {
    const userId = req.headers.userid;
    if (userId == null) {
      return res.status(500).json({
        message: "user id not valid",
      });
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (user == null) {
      return res.status(500).json({
        message: "user doesnot exist",
      });
    }
    const blogs = await prisma.blog.findMany();

    return res.status(200).json({
      data: blogs,
      message: "blogs fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = { blogRoutes: router };
