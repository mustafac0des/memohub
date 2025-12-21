const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Register request received:", { username, password: password ? "***" : "missing" });
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    console.log("User created:", user.id);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err.message, err.stack);
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
