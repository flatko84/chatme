const Sequelize = require("sequelize");
const sequelize = new Sequelize("chatme", "root", "c23q4wxC23Q4WX", {
  dialect: "mysql",
  host: "localhost",
  port: 3306
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