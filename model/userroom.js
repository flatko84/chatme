const Sequelize = require("sequelize");
const sequelize = require('./db.js');


const UserRoom = sequelize.define('user_to_rooms', {
    user_to_room_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: Sequelize.INTEGER,
    room_id: Sequelize.INTEGER
},
{
    timestamps: false
});

  module.exports = UserRoom;