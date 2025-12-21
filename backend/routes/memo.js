const router = require("express").Router();
const auth = require("../middleware/auth");
const Memo = require("../models/Memo");
const { Op } = require("sequelize");

// Get all memos for a user with optional filtering
router.get("/", auth, async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const where = { UserId: req.user.id };
    
    if (category && category !== "All") {
      where.category = category;
    }
    
    if (search) {
      where.content = { [Op.like]: `%${search}%` };
    }
    
    let order = [["pinned", "DESC"], ["updatedAt", "DESC"]];
    if (sort === "oldest") {
      order = [["pinned", "DESC"], ["createdAt", "ASC"]];
    } else if (sort === "alphabetical") {
      order = [["pinned", "DESC"], ["content", "ASC"]];
    }
    
    const memos = await Memo.findAll({
      where,
      order,
      attributes: ["id", "content", "category", "pinned", "color", "createdAt", "updatedAt"]
    });
    
    res.json(memos);
  } catch (err) {
    console.error("Get memos error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get categories for a user
router.get("/categories", auth, async (req, res) => {
  try {
    const memos = await Memo.findAll({
      where: { UserId: req.user.id },
      attributes: ["category"],
      raw: true,
      group: ["category"]
    });
    
    const categories = memos
      .map(m => m.category)
      .filter(Boolean)
      .sort();
    
    res.json(["All", "General", ...categories.filter(c => c !== "General")]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new memo
router.post("/", auth, async (req, res) => {
  try {
    const { content, category = "General", color = "#3b82f6" } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Memo content cannot be empty" });
    }
    
    const memo = await Memo.create({
      content: content.trim(),
      category,
      color,
      UserId: req.user.id
    });
    
    res.status(201).json(memo);
  } catch (err) {
    console.error("Create memo error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a memo
router.put("/:id", auth, async (req, res) => {
  try {
    const { content, category, pinned, color } = req.body;
    const memo = await Memo.findOne({
      where: { id: req.params.id, UserId: req.user.id }
    });
    
    if (!memo) {
      return res.status(404).json({ error: "Memo not found" });
    }
    
    if (content !== undefined) memo.content = content.trim();
    if (category !== undefined) memo.category = category;
    if (pinned !== undefined) memo.pinned = pinned;
    if (color !== undefined) memo.color = color;
    
    await memo.save();
    res.json(memo);
  } catch (err) {
    console.error("Update memo error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a memo
router.delete("/:id", auth, async (req, res) => {
  try {
    const memo = await Memo.findOne({
      where: { id: req.params.id, UserId: req.user.id }
    });
    
    if (!memo) {
      return res.status(404).json({ error: "Memo not found" });
    }
    
    await memo.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Delete memo error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
