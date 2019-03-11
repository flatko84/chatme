const Sequelize = require("sequelize");

const db = {
  database: "chatme",
  username: "root",
  password: "c23q4wxC23Q4WX",
  dialect: "mysql",
  host: "localhost",
  port: 3306
}

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: db.port
});

module.exports = sequelize;
