const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  content: { type: String, required: true, minLength: 1 },
  date: { type: Schema.Types.Date, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  isPublished: { type: Schema.Types.Boolean, required: true, default: false },
});

module.exports = mongoose.model("Article", ArticleSchema);
