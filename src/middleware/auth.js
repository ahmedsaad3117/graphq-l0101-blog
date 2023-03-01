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
    req.user = user;   //OPTIONAL req.user: #next.user#, auth.user LINE:B
    next();
  } catch (err) {
    res.status(401).send({ error: "Please Authntacte.." });
  }
};

module.exports = auth;
