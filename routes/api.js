const router = require("express").Router();
const auth = require("./auth");
const article = require("./article");
const comment = require("./comment");

router.use("/", auth);
router.use("/articles", article);
router.use("/comments", comment);

module.exports = router;
