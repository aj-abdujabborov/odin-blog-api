// Auth modules
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
// Controller help
const asyncHandler = require("express-async-handler");
const { body, validationResult, matchedData } = require("express-validator");
// My modules
const User = require("../models/user");
const token = require("./token");

// --- AUTHENTICATION ---
// Authentication
passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    const authFailed = {
      msg: "Wrong email or password",
    };

    try {
      const user = await User.findOne({ username }, "+password").exec();
      if (!user || !user.id) return done(null, false, authFailed);

      const match = await bcrypt.compare(password, user.password);
      if (match !== true) return done(null, false, authFailed);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// --- VALIDATIONS ---
const signupValidationArray = [
  body(
    "username",
    "Username must be at least 4 characters. It can include alphanumeric characters as well dots, dashes and underscores",
  )
    .matches(/^[a-zA-Z0-9._-]{4,}$/)
    .escape(),
  body("username", "Username already exists").custom(async (value) => {
    const user = await User.findOne({ username: value }).exec();
    if (user) throw new Error("Username already exists");
  }),
  body("password", "Password must be at least 4 characters long")
    .isLength({
      min: 4,
    })
    .escape(),
  body("confirmPassword", "Confirmation password should match password")
    .escape()
    .custom((value, { req }) => value === req.body.password),
];

// -- CONTROLLERS --
exports.signUp = [
  ...signupValidationArray,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(data.password, 16);
    const user = {
      username: data.username,
      password: hashedPassword,
    };
    const doc = new User(user);
    await doc.save();

    req.user = { username: doc.username, _id: doc._id };
    return next();
  }),
  token.signIn,
];

exports.logIn = [
  passport.authenticate("login", {
    session: false,
    failureMessage: true,
    // failWithError: true,
  }),
  (req, res, next) => {
    req.user = { username: req.user.username, _id: req.user._id };
    next();
  },
  token.signIn,
];
