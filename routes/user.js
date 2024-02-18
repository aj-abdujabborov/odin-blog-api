const router = require("express").Router();
const UserController = require("../controllers/user");

router.get("/:userId", UserController.getUser);
router.get("/:userId/articles", UserController.getAllArticles);
router.get("/:userId/comments", UserController.getAllComments);

module.exports = router;
