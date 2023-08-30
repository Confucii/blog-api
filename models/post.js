const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
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
