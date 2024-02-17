const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true, minLength: 2 },
  date: { type: Schema.Types.Date, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  article: { type: Schema.Types.ObjectId, required: true, ref: "Article" },
});

module.exports = mongoose.model("Comment", CommentSchema);
