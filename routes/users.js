const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

/* GET users listing. */
router.post("/login", userController.login);

module.exports = router;
