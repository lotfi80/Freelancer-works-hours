import User from "../models/user.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../resend/email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  const { user_name, first_name, last_name, email, password } = req.body;
  try {
    if (!user_name || !first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const verificationToken = generateVerificationToken();
    const user = new User({
      user_name,
      first_name,
      last_name,
      email,
      password,
      verificationToken: verificationToken,
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
    });
    const accessToken = generateJWTToken(res, user._id);
    console.log(accessToken);

    await user.save();
    // const accessToken = generateJWTToken(res, user._id);
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1h", // Refresh token will expire in 1 hour
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: +1 * 60 * 60 * 1000,
    });
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 2 * 60 * 1000, // 2 minutes
    // });

    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const accessToken = generateJWTToken(res, user._id);

    // ✅ HIER: Refresh Token generieren und als Cookie speichern
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1h", // Refresh token will expire in 1 hour
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: +1 * 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Token ist gültig – neuen Access Token erstellen
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    // Access-Token als Cookie zurückgeben
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000, // 5 Minuten
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: "Access token refreshed",
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken"); // Clear the JWT token cookie
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpiresAt: { $gt: Date.now() }, // Check if token is still valid
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying email",
    });
  }
};
export const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const resetPasswordToken = generateVerificationToken();
    const resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;
    console.log(resetPasswordToken);
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    user.password = password; // Assuming password is hashed in the User model pre-save hook
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpiresAt = undefined; // Clear the expiration date
    await user.save();
    await sendResetSuccessEmail(user.email);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    // const user = await User.findById(req.userId).select("-password");
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
