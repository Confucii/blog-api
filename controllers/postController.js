const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const passport = require("passport");
const Comment = require("../models/comment");
const authenticateHelper = require("../helpers/authenticateHelper");

exports.getPosts = asyncHandler(async (req, res) => {
  let allPosts = await Post.find().sort({ timestamp: -1 }).exec();

  allPosts = allPosts.map((post) => {
    return { ...post._doc, date: post.date };
  });

  res.status(200).json(allPosts);
});

exports.getPost = asyncHandler(async (req, res) => {
  let [post, comments] = await Promise.all([
    Post.findById(req.params.postid),
    Comment.find({ post: req.params.postid }, "-post")
      .sort({ timestamp: -1 })
      .exec(),
  ]);

  let postWithDate = { ...post._doc, date: post.date };
  if (comments.length > 0) {
    comments = comments.map((comment) => {
      return { ...comment._doc, date: comment.date };
    });
  }

  res.status(200).json({ post: postWithDate, comments });
});

exports.postPost = [
  (req, res, next) => {
    authenticateHelper.jwtHandler(req, res, next);
  },
  body("title", "Title should be at least 5 characters")
    .trim()
    .isLength({ min: 5 }),
  body("text", "Text should be at least 1 character")
    .isLength({ min: 1 })
    .trim(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        posted: req.body.posted,
      });
      await post.save();
      res.status(200).json({ message: "Post added successfully" });
    }
  }),
];

exports.updatePost = [
  passport.authenticate("jwt", { session: false }),
  body("title", "Title should be at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title should be at least 5 characters long"),
  body("text", "Text should be at least 1 character")
    .trim()
    .isLength({ min: 1 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      await Post.findByIdAndUpdate(req.params.postid, {
        title: req.body.title,
        text: req.body.text,
        posted: req.body.posted,
        ...(req.body.posted === "true" && { timestamp: Date.now() }),
      });
      res.status(200).json({ message: "Post updated successfully" });
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

    res.status(200).json({ message: "Post deleted successfully" });
  }),
];
