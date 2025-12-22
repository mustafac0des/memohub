require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectWithRetry } = require("./config/db");
const client = require("prom-client");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Collect default Prometheus metrics
client.collectDefaultMetrics();

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Application routes
app.use("/auth", require("./routes/auth"));
app.use("/memo", require("./routes/memo"));

// Start server after DB connection
async function start() {
  try {
    await connectWithRetry();
    await sequelize.sync();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();