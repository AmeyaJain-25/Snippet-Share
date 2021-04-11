//Models----------------
const User = require("../models/user.js");
//Packages----------------
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//---------------------
//SIGN UP
exports.signup = (req, res) => {
  const { email, password, username } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "This Email Already Exist. PLease try with another one",
      });
    }
  });
  User.findOne({ username: username }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "This Username is already taken. Please take another one",
      });
    }
  });

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ err: "Not able to save User in DB" });
    }
    res.json({
      name: user.name,
      email: user.email,
      username: user.username,
      id: user._id,
    });
  });
};

//---------------------
//SIGN IN
exports.signin = (req, res) => {
  const { email, password, username } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  if (!email && !username) {
    return res.status(400).json({
      error: "Please Enter Username Or Email",
    });
  }

  User.findOne(
    { $or: [{ email: email }, { username: username }] },
    (err, user) => {
      if (err || !user) {
        if (req.body.email) {
          return res.status(400).json({
            error: "Email Doesn't Exist",
          });
        } else {
          return res.status(400).json({
            error: "Username Doesn't Exist",
          });
        }
      }
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Invalid password",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.SECRET);

      res.cookie("token", token, { expire: new Date() + 9999 });
      user.profile_photo.data = undefined;
      const {
        _id,
        name,
        email,
        username,
        profile_photo,
        role,
        followers,
        following,
      } = user;
      res.json({
        token,
        user: {
          _id,
          name,
          email,
          username,
          profile_photo,
          role,
          followers,
          following,
        },
      });
    }
  );
};

//---------------------
//SIGN OUT
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "USER SIGNOUT SUCCESFULLY",
  });
};


//-----------------------------------------
//PROTECTED ROUTES
//-----------------------------------------

//Authentication for Sign In
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});


//-----------------------------------------
//CUSTOM MIDDLEWARE
//-----------------------------------------

//Checking for authentication
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

//Checking for user is admin or not.
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "You aren't ADMIN. Access Denied",
    });
  }
  next();
};