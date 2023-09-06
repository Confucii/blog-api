const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const showdown = require("showdown");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const converter = new showdown.Converter();

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    set: (val) => DOMPurify.sanitize(val),
  },
  text: {
    type: String,
    required: true,
    set: (val) => DOMPurify.sanitize(converter.makeHtml(val)),
  },
  timestamp: { type: Date, default: Date.now },
  colors: {
    type: [Number],
    default: () => {
      return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ];
    },
  },
  deg: {
    type: Number,
    default: () => {
      return Math.floor(Math.random() * 361);
    },
  },
  posted: { type: Boolean, default: false },
});

PostSchema.virtual("date").get(function () {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
    : "";
});

module.exports = mongoose.model("Post", PostSchema);
