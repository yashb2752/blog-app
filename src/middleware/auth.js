const { PrismaClient } = require("@prisma/client");

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers.userid;
    const intUserId = parseInt(userId);
    if (!userId || intUserId <= 0) {
      throw new Error("Please pass valid userid in headers");
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: intUserId,
      },
    });

    if (!user) {
      throw new Error("User not authenticated!");
    }

    next();
  } catch (err) {
    return res.status(403).json({
      message: err.message,
    });
  }
};

module.exports = { authMiddleware };
