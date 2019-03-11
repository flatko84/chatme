const Sequelize = require("sequelize");
const sequelize = require('./db.js');

const User = sequelize.define(
  "users",
  {
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    salt: Sequelize.TEXT,
    email: Sequelize.TEXT
  },
  { timestamps: false }
);

module.exports = User;