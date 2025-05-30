import User from "../models/user.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateRereshToken } from "../utils/generateJWTToken.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../resend/email.js";
import bcrypt from "bcryptjs";

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
    console.log(verificationToken);

    console.log(verificationToken);
    const user = new User({
      user_name,
      first_name,
      last_name,
      email,
      password,
      verificationToken: verificationToken,
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
    });
    await user.save();
    generateRereshToken(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      succuss: true,
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
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    generateRereshToken(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
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
export const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.ACCESS_REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        {
          userId: foundUser._id,
          UserInfo: {
            user_name: foundUser.user_name,
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
            email: foundUser.email,
          },
          isAdmin: foundUser.isAdmin,
          isVerified: foundUser.isVerified,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "25s" }
      );
      return res.status(200).json({
        accessToken,
        email: foundUser.email,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        user_name: foundUser.user_name,
      });
    }
  );
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken"); // Clear the JWT token cookie
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
    user.verificationToken = undefined; // Clear the verification token
    user.verificationExpiresAt = undefined; // Clear the expiration date
    await user.save();
    await sendWelcomeEmail(user.email, user.name); // Optional: Send a welcome email after verification
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {}
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
//

//re_USbRG7oY_KbBdVHXkAhcYQvRHjn4QTjUK
