const router = require("express").Router();
const article = require("./article");

router.use("/articles", article);

module.exports = router;
