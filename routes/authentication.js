var express = require('express');
const passport = require("passport");
var router = express.Router();

const {isLoggedIn, isNotLoggedIn} = require("../lib/protect");

router.get('/', function(req, res, next) {
  res.send("authentication");
});

router.get('/signup', isNotLoggedIn, function(req, res, next) {
  res.render("auth/signup");
});

router.post('/signup', isNotLoggedIn, passport.authenticate("local.signup",{
    successRedirect: "/authentication/profile",
    failureRedirect: "/authentication/signup",
    failureFlash:true
}));

router.get('/signin', isNotLoggedIn, function(req, res, next) {
  res.render("auth/signin");
});

router.post('/signin', isNotLoggedIn,(req,res,next)=>{
  passport.authenticate("local.signin", {
    successRedirect: "/authentication/profile",
    failureRedirect: "/authentication/signin",
    failureFlash:true
  })(req, res, next);
});

router.get("/profile", isLoggedIn,(req,res)=>{
  res.render("profile");
});

router.get("/logout", isLoggedIn,(req,res)=>{
  req.logOut();
  res.redirect("/authentication/signin");
});

module.exports = router;