const router = require("express").Router();
const CommentController = require("../controllers/comment");
const { autheticateToken } = require("../controllers/token");

router.get("/:commentId", CommentController.getComment);
router.use(autheticateToken);
router.put("/:commentId", CommentController.updateComment);
router.delete("/:commentId", CommentController.deleteComment);

module.exports = router;
