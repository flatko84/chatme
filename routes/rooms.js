var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const { check, validationResult } = require("express-validator/check");
var Room = require("../model/room.js");
var crypto = require("crypto");

router.get("/", function(req, res, next) {
  //if (req.user) {
      Room.findAll({ where: { open: '1' } }).then(rooms => {
        res.send(rooms);
      })
    
//    } else {
//      res.send({});
//    }
});


router.get("/:id", function(req, res, next){
      //if (req.user) {
        Room.findOne({ where: { open: '1', room_id: req.params.id } }).then(room => {
            res.render('room', {room: room, username: 'user'/*req.user.username*/});
          })
        
    //    } else {
    //      res.send({});
    //    }
});

//TO DO - delete from user_room when leaving page on frontend
router.delete("/:id", function(req, res, next){
    //if (req.user) {
      Room.findOne({ where: { open: '1', room_id: req.params.id } }).then(room => {
          res.render('room', {room: room, username: 'user'/*req.user.username*/});
        })
      
  //    } else {
  //      res.send({});
  //    }
});


module.exports = router;