const express = require("express");

const app = express();
app.use(express.json());

// Fake DB (مؤقت)
const users = [];

// Register
app.post("/api/auth/register", (req, res) => {
  const user = req.body;
  users.push(user);
  
  res.json({ message: "User registered (fake DB)", user });
});

// Home
app.get("/", (req, res) => {
  res.send("TaskFlow backend is working 🚀");
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});
// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});