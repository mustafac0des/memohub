const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Memo = sequelize.define("Memo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "General"
  },
  pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#3b82f6"
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  timestamps: true
});

User.hasMany(Memo, { onDelete: "CASCADE" });
Memo.belongsTo(User);

module.exports = Memo;
