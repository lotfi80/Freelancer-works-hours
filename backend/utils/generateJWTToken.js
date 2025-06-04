import jwt from "jsonwebtoken";

export const generateJWTToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5m", // Token will expire in 30 days
  });

  // Set the JWT token in a cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    // sameSite: "strict", // Helps prevent CSRF attacks
    sameSite: "lax",
    // maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    maxAge: 5 * 60 * 1000, // Cookie expiration time (5 minutes)
  });

  return accessToken;
};
// export const generaterefreshToken = (res, userId) => {
//   const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: "10m",
//   });
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 10 * 60 * 1000, // 10 Minuten
//   });
//   return refreshToken;
// };

// export const createRefreshToken = (res, userId) => {
//   const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
//   });

//   return refreshToken;
// };

export const generateRereshToken = (res, userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1h", // Refresh token will expire in 1 hour
  });
  console.log(refreshToken);

  // Set the refresh token in a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    // sameSite: "strict", // Helps prevent CSRF attacks
    sameSite: "lax",
    // maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
    maxAge: 1 * 60 * 60 * 1000,
  });

  return refreshToken;
};
// export const handleRefreshToken = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "No refresh token provided" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Neuer Access Token
//     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "2m",
//     });

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 2 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Access token refreshed",
//     });
//   } catch (err) {
//     return res
//       .status(403)
//       .json({ message: "Invalid or expired refresh token" });
//   }
// };
// export const handleRefreshToken = async (req, res) => {
//   try {
//     // Refresh Token aus Cookie lesen
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "No refresh token provided",
//       });
//     }

//     // Refresh Token verifizieren
//     jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET,
//       async (err, decoded) => {
//         if (err) {
//           console.error("Refresh token verification error:", err);
//           return res.status(403).json({
//             success: false,
//             message: "Invalid refresh token",
//           });
//         }

//         // User aus DB holen um sicherzustellen, dass er noch existiert
//         const user = await User.findById(decoded.userId);
//         if (!user) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found",
//           });
//         }

//         // Neuen Access Token generieren (kurze Lebensdauer)
//         const accessToken = jwt.sign(
//           { userId: user._id },
//           process.env.JWT_SECRET,
//           { expiresIn: "15m" } // Kurze Lebensdauer für Access Token
//         );

//         return res.status(200).json({
//           success: true,
//           accessToken,
//           user: {
//             _id: user._id,
//             email: user.email,
//             name: user.name,
//             isVerified: user.isVerified,
//           },
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Refresh token error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
