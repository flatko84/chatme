const Sequelize = require("sequelize");
const sequelize = new Sequelize("chatme", "root", "c23q4wxC23Q4WX", {
  dialect: "mysql",
  host: "localhost",
  port: 3306
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