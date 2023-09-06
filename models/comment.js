const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
    set: (val) => DOMPurify.sanitize(val),
  },
  author: {
    type: String,
    set: (val) => (val === "" ? "Anonymous" : DOMPurify.sanitize(val)),
  },
  timestamp: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

CommentSchema.virtual("date").get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(
        DateTime.DATETIME_MED_WITH_SECONDS
      )
    : "";
});

module.exports = mongoose.model("Comment", CommentSchema);
