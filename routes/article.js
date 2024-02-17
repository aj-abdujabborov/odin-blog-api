const router = require("express").Router();
const ArticleController = require("../controllers/article");
const CommentController = require("../controllers/comment");
const { autheticateToken } = require("../controllers/token");

router.get("/", ArticleController.getAllArticles);
router.get("/:articleId", ArticleController.getArticle);
router.get("/:articleId/comments", CommentController.getAllComments);
router.use(autheticateToken);
router.post("/", ArticleController.newArticle);
router.put("/:articleId", ArticleController.updateArticle);
router.post("/:articleId/comments", CommentController.newComment);
router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;
