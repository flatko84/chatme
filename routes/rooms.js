var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const { check, validationResult } = require("express-validator/check");
var Room = require("../model/room.js");
var crypto = require("crypto");

router.get("/", function(req, res, next) {
  if (req.user) {
    res.render('rooms', {username: req.user.username});
  } else {
    res.redirect('/account/login');
  }
});

router.get("/:id", function(req, res, next) {
  if (req.user) {
    res.render("room", {
      roomName: req.params.id,
      token: "",
      username: req.user.username
    });
  } else {
    res.redirect("/account/login");
  }
});

//TO DO - delete from user_room when leaving page on frontend
router.delete("/:id", function(req, res, next) {
  if (req.user) {
    Room.findOne({ where: { open: "1", room_id: req.params.id } }).then(
      room => {
        res.render("room", { room: room, username: req.user.username });
      }
    );
  } else {
    res.send({});
  }
});

module.exports = router;
