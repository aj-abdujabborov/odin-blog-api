const asyncHandler = require("express-async-handler");
const { body, validationResult, matchedData } = require("express-validator");
const Article = require("../models/article");

exports.getAllArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({}).populate("author").exec();
  if (!articles.length) {
    return res
      .status(404)
      .json({ status: 404, message: "No articles in database" });
  }
  res.status(200).json({ status: 200, articles });
});

exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.articleId)
    .populate("author")
    .exec();

  if (!article) {
    return res.status(404).json({ status: 404, message: "No article found" });
  }

  res.status(200).json({ status: 200, article });
});

exports.newArticle = [
  body("title", "Title is required").isLength({ min: 1 }).trim().escape(),
  body("content", "Content is required").isLength({ min: 1 }).trim().escape(),

  asyncHandler(async (req, res, next) => {
    const article = matchedData(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid fields",
        errors: errors.array(),
      });
    }

    article.date = new Date();
    article.author = req.user._id;

    const doc = new Article(article);
    await doc.save();

    res.status(201).json({ status: 201, message: "Success: article posted" });
  }),
];

exports.updateArticle = [
  body("title", "Title is required")
    .optional({ values: "null" })
    .isLength({ min: 0 })
    .trim()
    .escape(),
  body("content", "Content is required")
    .optional({ values: "null" })
    .isLength({ min: 0 })
    .trim()
    .escape(),

  asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.articleId)
      .populate("author")
      .exec();

    if (article.author.id !== req.user._id) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to modify this article",
      });
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
    const modifiedArticle = Object.assign(article, data);
    await modifiedArticle.save();

    return res
      .status(201)
      .json({ status: 201, message: "Success: article modified" });
  }),
];

exports.deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.articleId)
    .populate("author")
    .exec();

  if (article.author.id !== req.user._id) {
    return res.status(403).json({
      status: 403,
      message: "You are not authorized to delete this article",
    });
  }

  await Article.findByIdAndDelete(req.params.articleId);

  return res
    .status(201)
    .json({ status: 201, message: "Success: article deleted" });
});
