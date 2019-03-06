var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const { check, validationResult } = require("express-validator/check");
var User = require("../model/user.js");
var Room = require("../model/room.js");
var crypto = require("crypto");

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ where: { username: username } }).then(user => {
      if (!user) {
        return done(null, false, { message: "No such User / Pass combination." });
      }

      let encPass = crypto
        .pbkdf2Sync(password, user.salt, 5, 128, "sha512")
        .toString("hex");
      if (encPass !== user.password) {
        return done(null, false, { message: "No such User / Pass combination." });
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/* Account routes */
router.get("/", function(req, res, next) {
  if (req.user) {
    res.render("account", { username: req.user.username });
  } else {
  res.redirect("/account/login");
  }
});

//login form
router.get("/login", function(req, res, next) {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
  
});

//login user
router.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/rooms/2",
    failureRedirect: "/account/login",
    failureFlash: true
  })(req, res, next);
});

//logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/account/login');
});

//register form
router.get("/register", function(req, res, next) {
  res.render("register");
});

//register user
router.post(
  "/register",
  [
    //validation
    check("username")
      .isLength({ min: 5 })
      .custom((value, { req }) => {
        return User.findOne({ where: { username: value } }).then(result => {
          if (result !== null) {
            return Promise.reject("Username already in use");
          }
        });
      }),
    check("password").isLength({ min: 8 }),
    check("email").isEmail()
    //      TO DO - fix validation returning "invalid string" when custom validation passes
    // check("confirm_password")
    // .custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     return Promise.reject("Password confirmation does not match password");
    //   }
    // })
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("register", {
        old: { username: req.body.username, email: req.body.email },
        errors: errors.mapped()
      });
    }
    //if validation is successful, create user
    let salt = crypto.randomBytes(20).toString("hex");
    let pass = crypto
      .pbkdf2Sync(req.body.password, salt, 5, 128, "sha512")
      .toString("hex");
    User.create({
      username: req.body.username,
      password: pass,
      salt: salt,
      email: req.body.email
    }).then(user => {
      res.redirect("/account/login");
    });
  }
);


module.exports = router;
