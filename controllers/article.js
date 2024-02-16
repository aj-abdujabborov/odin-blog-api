const asyncHandler = require("express-async-handler");
const { body, validationResult, matchedData } = require("express-validator");
const Article = require("../models/article");

exports.getAllArticles = asyncHandler((req, res, next) => {
  res.send("All articles in JSON format");
});

exports.getArticle = asyncHandler((req, res, next) => {
  res.send("An article in JSON format");
});

exports.newArticle = asyncHandler((req, res, next) => {
  res.send("A new article is posted");
});

exports.updateArticle = asyncHandler((req, res, next) => {
  res.send("An article is updated");
});

exports.deleteArticle = asyncHandler((req, res, next) => {
  res.send("An article is deleted");
});
