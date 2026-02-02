const { Sequelize } = require("sequelize");

const DB_DIALECT = process.env.DB_DIALECT || "mysql";
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || "memohub";
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || "root";
const DB_PASS = process.env.DB_PASS || process.env.MYSQL_PASSWORD || "password";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
const DB_URL = process.env.DATABASE_URL || process.env.DB_URL || null;

let sequelize;
if (DB_URL) {
  sequelize = new Sequelize(DB_URL, {
    dialect: DB_DIALECT,
    logging: false,
  });
} else {
  const options = {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,
  };
  if (DB_PORT) options.port = DB_PORT;
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, options);
}

// Log non-sensitive DB configuration for debugging
console.log(`🔧 DB config: host=${DB_HOST} port=${DB_PORT || "(default)"} db=${DB_NAME} user=${DB_USER} dialect=${DB_DIALECT}`);

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
      console.error(`⚠️  DB connection failed: ${err && (err.message || err)}. Retrying in 3s... (${attempts}/10)`);
      if (err && err.original && err.original.code) {
        console.error(`🔍 Sequelize / MySQL error code: ${err.original.code}`);
      }
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  if (!connected) {
    throw new Error("Failed to connect to database after 10 attempts");
  }
}

module.exports = { sequelize, connectWithRetry };
