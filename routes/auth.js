const express = require("express");
const router = express.Router();
//Functions importing------------
const {
  signout,
  signup,
  signin,
  isSignedIn,
} = require("../controllers/auth.js");
//Packages--------------------
const { check, validationResult } = require("express-validator");


//--------------------------------
//ROUTES
//--------------------------------

//SIGNUP--------------------
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 Characters"),
    check("email").isEmail().withMessage("Email is required"),
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username must be greater than 3 characters")
      .isLength({ max: 10 })
      .withMessage("Username cannot be greater than 10 characters")
      .isAlphanumeric()
      .withMessage("User name can take only alphabets or number WITHOUT any spaces."),
    check("password")
      .isLength({ min: 3 })
      .withMessage("Password must be atleast 3 Characters"),
  ],
  signup
);

//SIGN IN--------------------
router.post(
  "/signin",
  [
    // check("email").isEmail().withMessage("Email is required"),
    // check("username").isLength({ min: 3 }).withMessage("Username is required"),
    check("password").isLength({ min: 3 }).withMessage("Password is required"),
  ],
  signin
);

//SIGN OUT ROUTE--------------------
router.get("/signout", signout);

module.exports = router;