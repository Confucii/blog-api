const { body } = require("express-validator");
const authenticateHelper = require("../helpers/authenticateHelper");
const asyncHandler = require("express-async-handler");

exports.login = [
  body("username").escape(),
  body("password").escape(),
  (req, res, next) => {
    authenticateHelper.loginHandler(req, res, next);
  },
];

exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("token", { sameSite: "none", secure: true })
    .json({ logout: true });
});
