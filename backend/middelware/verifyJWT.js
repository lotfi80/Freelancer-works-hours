import jwt from "jsonwebtoken"; // 👈 Korrekt für ES-Module
import dotenv from "dotenv";
dotenv.config();

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1]; // Extract the token from the header .split() strin to array => dann der array ist so  ["Bearer", "token"], [1] ist // der token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded.UserInfo.id; // Attach user info to the request object
    next(); // Call the next middleware or route handler
  });
};
export default verifyJwt;
