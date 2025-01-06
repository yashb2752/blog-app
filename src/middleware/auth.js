const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new Error("Token not found");
    }

    const token = bearerToken.split(" ")[1];
    if (!token) {
      throw new Error("Token not found");
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = payload.id;
    const userEmail = payload.email;

    if (!userId || !userEmail) {
      throw new Error("User not found");
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email: userEmail,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.body.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      message: err.message,
    });
  }
};

module.exports = { authMiddleware };
