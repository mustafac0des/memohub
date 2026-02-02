const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    retry: {
      max: 10
    },
    logging: false
  }
);

async function connectWithRetry() {
  let connected = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!connected && attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully");
      connected = true;
    } catch (err) {
      attempts++;
      console.log(`⚠️  Database connection failed (${attempts}/${maxAttempts})`);
      console.error(`   Error: ${err.message}`);

      if (attempts < maxAttempts) {
        console.log("   Retrying in 3 seconds...");
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }

  if (!connected) {
    throw new Error(`Failed to connect to database after ${maxAttempts} attempts. Please check your database configuration.`);
  }
}

module.exports = { sequelize, connectWithRetry };
