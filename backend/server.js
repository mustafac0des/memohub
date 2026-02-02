require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectWithRetry } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", require("./routes/auth"));
app.use("/memo", require("./routes/memo"));

async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    await connectWithRetry();
    await sequelize.sync();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

start();