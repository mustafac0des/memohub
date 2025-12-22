require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectWithRetry } = require("./config/db");

const client = require('prom-client');
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/memo", require("./routes/memo"));

async function start() {
  try {
    await connectWithRetry();
    await sequelize.sync();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Backend running on ${process.env.PORT || 5000}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

