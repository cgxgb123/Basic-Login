// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// TASK 2: REGISTER ENDPOINT
// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // 2.  new user ("Pre-save" hook handles hashing)
    const newUser = await User.create({ username, email, password });

    // 3. Respond with the user object
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TASK 3: LOGIN ENDPOINT
// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // 2. Validate password
    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // 3.  JWT Payload
    const payload = { _id: user._id, username: user.username };

    // 4. Sign Token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Respond with Token and User Data
    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
