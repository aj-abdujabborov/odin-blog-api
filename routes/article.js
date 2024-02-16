const router = require("express").Router();
const ArticleController = require("../controllers/article");

router.get("/", ArticleController.getAllArticles);
router.get("/:articleId", ArticleController.getArticle);
router.post("/", ArticleController.newArticle);
router.put("/:articleId", ArticleController.updateArticle);
router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;
