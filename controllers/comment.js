const asyncHandler = require("express-async-handler");
const { body, validationResult, matchedData } = require("express-validator");
const Comment = require("../models/comment");

exports.getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find(
    { article: req.params.articleId },
    "-article",
  )
    .populate("author")
    .exec();

  res.status(200).json({ status: 200, comments });
});

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId, "-article")
    .populate("author")
    .exec();

  if (!comment) {
    const err = new Error("Comment not found");
    err.status = 404;
    return next(err);
  }

  return res.json({ status: 200, comment });
});

exports.newComment = [
  body("content", "Content is required").isLength({ min: 2 }).trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const data = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid fields",
        errors: errors.array(),
      });
    }

    const comment = new Comment({
      ...data,
      date: new Date(),
      author: req.user._id,
      article: req.params.articleId,
    });
    await comment.save();

    return res
      .status(201)
      .json({ status: 201, message: "Success: comment posted" });
  }),
];

exports.updateComment = [
  body("content", "Content is required").isLength({ min: 2 }).trim().escape(),
  asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId).exec();

    if (comment.author.toString() !== req.user._id) {
      const err = new Error("You are not authorized to modify this comment");
      err.status = 403;
      return next(err);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid fields",
        errors: errors.array(),
      });
    }

    const data = matchedData(req);
    comment.content = data.content;
    await comment.save();

    return res
      .status(201)
      .json({ status: 201, message: "Success: comment edited" });
  }),
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).exec();

  if (comment.author.toString() !== req.user._id) {
    const err = new Error("You are not authorized to delete this comment");
    err.status = 403;
    return next(err);
  }

  await Comment.findByIdAndDelete(req.params.commentId).exec();

  return res
    .status(201)
    .json({ status: 201, message: "Success: comment deleted" });
});
