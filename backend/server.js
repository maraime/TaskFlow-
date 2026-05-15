const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

// Fake DB (مؤقت)
const users = [];

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    fullName,
    email,
    password: hashedPassword
  };

  users.push(user);

  res.json({
    message: "User registered successfully",
    user
  });
});

// Home
app.get("/", (req, res) => {
  res.send("TaskFlow backend is working 🚀");
});
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email
  );

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials"
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { email: user.email },
    "mySecretKey",
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user
  });
});
// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});