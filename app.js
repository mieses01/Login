//jshint esversion:6
require("dotenv").config(); //encrypt variables
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

const bcrypt = require("bcryptjs");
var saltRound = bcrypt.genSaltSync(10);

app.use(bodyparser.urlencoded({
  extended: true
}));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);
//codigo
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: username
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        passresult = bcrypt.compareSync(password, result.password);
        if (passresult===true){
          res.render("secrets");
        }
      }
    }
  });
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) {
var hash = bcrypt.hashSync(req.body.password, saltRound);

  const newUser = new User({
    email: req.body.username,
    password: hash
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
app.listen(3000, function() {
  console.log("Running in port 3000");
});
