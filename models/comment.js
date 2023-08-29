const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, set: (val) => (val === "" ? "Anonymous" : val) },
  timestamp: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

CommentSchema.virtual("date").get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
    : "";
});

module.exports = mongoose.model("Comment", CommentSchema);
