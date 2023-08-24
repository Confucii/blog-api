const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  posted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Post", PostSchema);
