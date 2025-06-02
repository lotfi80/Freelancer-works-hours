import jwt from "jsonwebtoken"; // 👈 Korrekt für ES-Module
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
// const verifyJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const accessToken = authHeader.split(" ")[1]; // Extract the token from the header .split() strin to array => dann der array ist so  ["Bearer", "token"], [1] ist // der token
//   if (!accessToken) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     req.user = decoded.UserInfo.id; // Attach user info to the request object
//     next(); // Call the next middleware or route handler
//   });
// };
// export default verifyJwt;
// const verifyJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const accessToken = authHeader.split(" ")[1];
//   if (!accessToken) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     req.user = decoded.userId; // ✅ Match the token structure
//     next();
//   });
// };
// export default verifyJwt;

// const verifyJwt = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || req.headers.Authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "No access token provided",
//       });
//     }

//     const accessToken = authHeader.split(" ")[1];

//     if (!accessToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token format",
//       });
//     }

//     jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         if (err.name === "TokenExpiredError") {
//           return res.status(401).json({
//             success: false,
//             message: "Access token expired",
//             needsRefresh: true, // ✅ Signal für Frontend
//           });
//         }

//         return res.status(403).json({
//           success: false,
//           message: "Invalid access token",
//         });
//       }

//       req.user = decoded.userId;
//       next();
//     });
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during authentication",
//     });
//   }
// };
// export default verifyJwt;
