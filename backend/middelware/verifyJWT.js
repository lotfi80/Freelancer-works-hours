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
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        needsRefresh: true,
      });
    }
  }
};
export default verifyJwt;

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const verifyJwt = (req, res, next) => {
//   let token = null;

//   // Token aus Cookies holen
//   if (req.cookies && req.cookies.accessToken) {
//     token = req.cookies.accessToken;
//   }
//   // Falls nicht in Cookies, dann aus Header
//   else if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Access token missing",
//       needsRefresh: true,
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded || !decoded.userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Access token expired",
//         needsRefresh: true,
//       });
//     }
//     console.error("JWT verify error:", error);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// export default verifyJwt;
