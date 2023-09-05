const asyncHandler = require("express-async-handler");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.loginHandler = asyncHandler(async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        domain: "https://confucii-blog-cms.netlify.app/",
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .cookie("auth", true, {
        domain: "https://confucii-blog-cms.netlify.app/",
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .send();
  })(req, res, next);
});

exports.jwtHandler = asyncHandler(async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, jwt_payload) => {
    if (err || !jwt_payload) {
      return res.status(401).clearCookie("token").clearCookie("auth").send();
    }
    req.user = jwt_payload;
    next();
  })(req, res, next);
});
