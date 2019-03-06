var session = require("express-session");
var expSess = session({ secret: "cats", resave: true, saveUninitialized: true });

module.exports = expSess;