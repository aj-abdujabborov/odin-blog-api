const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true, minLength: 1 },
  date: { type: Schema.Types.Date, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  isPublished: { type: Schema.Types.Boolean, required: true, default: false },
});

module.exports = mongoose.model("Comment", CommentSchema);
