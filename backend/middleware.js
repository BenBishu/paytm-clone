//confirmation of the token with the userId happens here
//jwt secret, here we have made a middleware to confirm something
const JWT_SECRET = require("./config.js");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHead = req.headers.authorization;
  if (!authHead) {
    return res.status(403).json({ message: "Invalid" });
  }
  const token = authHead.replace("Bearer ", "");

  //jwt.verify returns the signature
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ err });
  }
};
module.exports = {
  authMiddleware,
};
