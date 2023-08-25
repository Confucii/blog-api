const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.getPosts);

router.post("/", postController.postPost);

router.get("/:postid", postController.getPost);

router.put("/:postid", postController.updatePost);

router.delete("/:postid", postController.deletePost);

module.exports = router;
