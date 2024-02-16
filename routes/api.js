const router = require("express").Router();
const article = require("./article");
const auth = require("./auth");

router.use("/", auth);
router.use("/articles", article);

module.exports = router;
