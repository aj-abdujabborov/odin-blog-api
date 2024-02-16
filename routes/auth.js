const router = require("express").Router();
const Auth = require("../controllers/auth");

router.post("/signup", Auth.signUp);
router.post("/login", Auth.logIn);

module.exports = router;
