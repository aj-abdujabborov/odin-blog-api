const jwt = require("jsonwebtoken");

function autheticateToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) return res.sendStatus(401);

  // Split "Bearer __key__" and take the key
  const [, token] = bearerHeader.split(" ");

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) return res.sendStatus(403);
    req.user = authData.user;
    return next();
  });
}

function signIn(req, res, next) {
  jwt.sign(
    { user: req.user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "28800s" },
    (err, token) => {
      if (err) return res.sendStatus(500);
      return res.json({ userId: req.user._id, token });
    },
  );
}

module.exports = { autheticateToken, signIn };
