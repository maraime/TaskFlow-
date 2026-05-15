require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

 
app.use(express.json());

/* =========================
   DATABASE (FAKE)
========================= */

const users = [];
const projects = [];

/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
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

/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    "secretKey",
    { expiresIn: "1h" }
  );

  console.log("TOKEN HERE >>>", token);

  return res.json({
    message: "LOGIN OK",
    token: token
  });
});

/* =========================
   DEBUG ROUTE (TEST TOKEN)
========================= */

app.get("/debug-login", (req, res) => {
  const user = {
    id: 1,
    email: "test@test.com"
  };

  const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });

  res.json({
    token
  });
});

/* =========================
   AUTH MIDDLEWARE
========================= */

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   PROJECTS
========================= */

app.post("/api/projects", authMiddleware, (req, res) => {
  const project = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline || null,
    status: req.body.status || "actif",
    owner: req.user.email
  };

  projects.push(project);

  res.json(project);
});

app.get("/api/projects", authMiddleware, (req, res) => {
  res.json(projects);
});

app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const project = projects.find(p => p.id == req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.status = req.body.status || project.status;

  res.json(project);
});

app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  const index = projects.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  projects.splice(index, 1);

  res.json({ message: "Project deleted" });
});

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.send("TaskFlow backend is working 🚀");
});

/* =========================
   START SERVER
========================= */
app.get("/debug-login", (req, res) => {
  const token = jwt.sign(
    { id: 1, email: "test@test.com" },
    "secretKey",
    { expiresIn: "1h" }
  );

  console.log("DEBUG TOKEN:", token);

  res.json({ token });
});
app.get("/test", (req, res) => {
  res.json({ ok: true });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});