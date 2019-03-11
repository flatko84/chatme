const Sequelize = require("sequelize");
const sequelize = require('./db.js');

const Room = sequelize.define(
  "rooms",
  {
    room_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.TEXT,
    open: Sequelize.BOOLEAN
  },
  { timestamps: false }
);


module.exports = Room;