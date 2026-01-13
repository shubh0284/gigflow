const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to create JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(newUser._id);

    // ✅ UPDATED FOR DEPLOYMENT
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for cross-site cookies
      sameSite: "none", // Allows Vercel to send cookies to Render
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, name, email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user._id);

    // ✅ UPDATED FOR DEPLOYMENT
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for cross-site cookies
      sameSite: "none", // Allows Vercel to send cookies to Render
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  // ✅ Ensure logout also uses the same cross-site settings
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
