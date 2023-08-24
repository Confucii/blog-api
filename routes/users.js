const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

/* GET users listing. */
router.post("/login", userController.login);

router.get(
  "/restricted",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: req.user });
  }
);

module.exports = router;
