import User from "../models/user.js";

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
    const user = await User.create({
      user_name,
      first_name,
      last_name,
      email,
      password,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
