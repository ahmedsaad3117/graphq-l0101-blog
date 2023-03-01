const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "secret");

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {  
      throw new Error();
    }

    req.token = token;
    req.user = user; 
    req.isAuth = true

    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};

module.exports = auth;
