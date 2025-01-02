const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const prisma = new PrismaClient();

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

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.headers.userid;

    if (title == null || content == null) {
      return res.status(500).json({
        message: "fields are empty",
      });
    }

    const prisma = new PrismaClient();

    const blog = await prisma.blog.create({
      data: {
        title: title,
        content: content,
        userId: parseInt(userId),
      },
    });

    return res.status(200).json({
      data: blog,
      message: "blog created successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:blogid", async (req, res) => {
  try {
    const userId = req.headers.userid;
    const blogId = req.params.blogid;

    if (blogId == null || userId == null) {
      return res.status(500).json({
        message: "error while getting data",
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
        message: "user not found",
      });
    }
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(blogId),
      },
    });

    if (blog == null) {
      return res.status(500).json({
        message: "blog not found",
      });
    }
    return res.status(200).json({
      message: "blog found",
      blog: blog,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/update/:blogid", async (req, res) => {
  try {
    const userId = req.headers.userid;
    const blogId = req.params.blogid;
    const { title, content } = req.body;

    if (userId == null || blogId == null || title == null || content == null) {
      return res.status(500).json({
        message: "error while getting data",
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
        message: "user not found",
      });
    }
    const blog = await prisma.user.findUnique({
      where: {
        id: parseInt(blogId),
      },
    });
    if (blog == null) {
      return res.status(500).json({
        message: "blog not found",
      });
    }
    const UpdatedBlog = await prisma.blog.update({
      where: {
        id: parseInt(blogId),
      },
      data: {
        content: content,
        title: title,
      },
    });

    return res.status(200).json({
      message: "blog updated successfully",
      updatedBlog: updatedBlog,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/delete/:blogid", async (req, res) => {
  try {
    const blogId = req.params.blogid;
    const userId = req.headers.userid;

    if (blogId == null || userId == null) {
      return res.status(500).json({
        message: "error while getting data",
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
        message: "user not found",
      });
    }
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(blogId),
      },
    });
    if (blog == null) {
      return res.status(500).json({
        message: "blog not found",
      });
    }
    console.log(blog);
    const deltedBlog = await prisma.blog.delete({
      where: {
        id: parseInt(blogId),
      },
    });

    return res.status(200).json({
      message: "blog deleted successfully!!",
      deltedBlog: deltedBlog,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = { blogRoutes: router };
