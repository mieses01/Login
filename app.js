//jshint esversion:6
require("dotenv").config(); //encrypt variables
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
userSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);
//codigo
app.get("/",function(req, res){
  res.render("home");
});
app.get("/login",function(req, res){
  res.render("login");
});
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, result){
    if (err){
      console.log(err);
    } else {
      if (result){
        if (result.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
app.get("/register",function(req, res){
  res.render("register");
});
app.post("/register",function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
app.listen(3000,function(){
  console.log("Running in port 3000");
});
