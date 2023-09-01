const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/login", userController.login);

router.post("/logout", userController.logout);

module.exports = router;
