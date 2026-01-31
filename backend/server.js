require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectWithRetry } = require("./config/db");
const client = require("prom-client");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/memo", require("./routes/memo"));

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