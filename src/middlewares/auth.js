const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized User: No token provided");
    }
    const decodedTokenObj = jwt.verify(token, "secreateKey");
    const { _id, email, role } = decodedTokenObj;
    const user = await User.findById(_id);
    if (!user) {
      res.status(401).send("Unauthorized User");
    } else {
      req.user = { _id, email, role };
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error" + err);
  }
};

module.exports = { userAuth };
