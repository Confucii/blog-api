const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const passport = require("passport");
const Comment = require("../models/comment");

exports.getPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find();

  res.status(200).json(allPosts);
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postid);

  res.status(200).json(post);
});

exports.postPost = [
  passport.authenticate("jwt", { session: false }),
  body("title", "Title should be at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("text").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
    });

    if (!errors.isEmpty()) {
      res.json({ post: post, errors: errors.array() });
    } else {
      await post.save();
      res.status(200).json({ message: "Post added successfully" });
    }
  }),
];

exports.updatePost = [
  passport.authenticate("jwt", { session: false }),
  body("title")
    .trim()
    .custom((val) => {
      return val === "" || val.length >= 5;
    })
    .withMessage("Title should be at least 5 characters long")
    .escape(),
  body("text").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const oldPost = await Post.findById(req.params.postid);

    const post = new Post({
      title: req.body.title || oldPost.title,
      text: req.body.text || oldPost.text,
      posted: req.body.posted || oldPost.posted,
      _id: req.params.postid,
      timestamp: oldPost.timestamp,
    });

    if (!errors.isEmpty()) {
      res.json({ post: post, errors: errors.array() });
    } else {
      await Post.findByIdAndUpdate(req.params.postid, post, {});
      res.status(200).json({ message: "Post updated" });
    }
  }),
];

exports.deletePost = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    await Promise.all([
      Comment.deleteMany({ post: req.params.postid }),
      Post.findByIdAndRemove(req.params.postid),
    ]);

    res.status(200).json({ message: "Deleted successfully" });
  }),
];
