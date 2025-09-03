const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // role optional

    // check user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please login",
        success: false,
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role user
    });

    await newUser.save();

    return res.status(201).json({
      message: "Signup successful",
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errorMsg = "Auth failed: email or password is incorrect";

    // check user exists
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // check password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // generate JWT including role
    const jwtToken = jwt.sign(
      { 
        email: existingUser.email, 
        _id: existingUser._id,
        role: existingUser.role // role included
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: {
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role, // role returned
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { signup, login };
