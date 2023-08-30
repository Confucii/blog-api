const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const passport = require("passport");

exports.getComments = asyncHandler(async (req, res) => {
  const allComments = await Comment.find();

  res.json(allComments);
});

exports.postComment = [
  body("text", "Comment should be at least 1 character long")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const comment = new Comment({
        author: req.body.author,
        text: req.body.text,
        post: req.body.post,
      });
      await comment.save();
      res.status(200).json({ message: "Comment added successfully" });
    }
  }),
];

exports.deleteComment = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    await Comment.findByIdAndRemove(req.params.commentid);
    res.status(200).json({ message: "Comment deleted successfully" });
  }),
];
