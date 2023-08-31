const { body } = require("express-validator");
const authenticateHelper = require("../helpers/authenticateHelper");

exports.login = [
  body("username").escape(),
  body("password").escape(),
  (req, res, next) => {
    authenticateHelper.loginHandler(req, res, next);
  },
];
