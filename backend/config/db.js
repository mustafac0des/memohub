const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "memohub",
  "root",
  "password",
  {
    host: "localhost",
    dialect: "mysql"
  }
);


async function connectWithRetry() {
  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 10) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected");
      connected = true;
    } catch (err) {
      attempts++;
      console.log(`⚠️  DB connection failed, retrying in 3s... (${attempts}/10)`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  if (!connected) {
    throw new Error("Failed to connect to database after 10 attempts");
  }
}

module.exports = { sequelize, connectWithRetry };
