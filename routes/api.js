const router = require("express").Router();
const auth = require("./auth");
const article = require("./article");
const comment = require("./comment");
const user = require("./user");

router.use("/", auth);
router.use("/articles", article);
router.use("/comments", comment);
router.use("/users", user);

module.exports = router;
