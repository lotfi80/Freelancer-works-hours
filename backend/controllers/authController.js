import User from "../models/user.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail } from "../resend/email.js";

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
    const user = new User({
      user_name,
      first_name,
      last_name,
      email,
      password,
      verificationToken,
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
    });
    await user.save();
    generateJWTToken(res, user._id);
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

//re_USbRG7oY_KbBdVHXkAhcYQvRHjn4QTjUK
