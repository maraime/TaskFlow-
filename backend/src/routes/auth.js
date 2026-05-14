const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      fullName,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;