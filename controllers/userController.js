const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.login = [
  body("username").escape(),
  body("password").escape(),
  asyncHandler(async (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: "1d",
      });
      return res.json({ token });
    })(req, res, next);
  }),
];
