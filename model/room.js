const Sequelize = require("sequelize");
const db = require('./db.js');
const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: db.port
});

const Room = sequelize.define(
  "rooms",
  {
    room_id: { type: Sequelize.INTEGER, primaryKey: true },
    name: Sequelize.TEXT,
    open: Sequelize.BOOLEAN
  },
  { timestamps: false }
);


module.exports = Room;