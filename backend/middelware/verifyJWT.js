import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyJwt = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Access token missing",
      needsRefresh: true,
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId; // Attach user ID to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        needsRefresh: true,
      });
    }
  }
};
export default verifyJwt;
