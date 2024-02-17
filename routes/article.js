const router = require("express").Router();
const ArticleController = require("../controllers/article");
const { autheticateToken } = require("../controllers/token");

router.get("/", ArticleController.getAllArticles);
router.get("/:articleId", ArticleController.getArticle);
router.use(autheticateToken);
router.post("/", ArticleController.newArticle);
router.put("/:articleId", ArticleController.updateArticle);
router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;
