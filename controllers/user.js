const asyncHandler = require("express-async-handler");
const Article = require("../models/article");
const Comment = require("../models/comment");
const User = require("../models/user");

const verifyUserExists = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();

  if (!user) {
    const err = new Error("No user found");
    err.status = 404;
    return next(err);
  }

  req.queriedUser = user;

  return next();
});

exports.getUser = [
  verifyUserExists,
  (req, res) => {
    res.status(200).json({ status: 200, user: req.queriedUser });
  },
];

exports.getAllArticles = [
  verifyUserExists,
  asyncHandler(async (req, res) => {
    const articles = await Article.find({ author: req.params.userId }).exec();
    res.status(200).json({ status: 200, articles });
  }),
];

exports.getAllComments = [
  verifyUserExists,
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ author: req.params.userId }).exec();
    res.status(200).json({ status: 200, comments });
  }),
];
