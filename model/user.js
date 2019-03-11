const Sequelize = require("sequelize");
const db = require('./db.js');
const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: db.port
});

const User = sequelize.define(
  "users",
  {
    user_id: { type: Sequelize.INTEGER, primaryKey: true },
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    salt: Sequelize.TEXT,
    email: Sequelize.TEXT
  },
  { timestamps: false }
);

module.exports = User;