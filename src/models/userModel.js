const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Invaild Email");
      }
    },
  },

  gender: {
    type: String,
    enum: ["MALE", "FEMALE"],
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password); 

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  return user;
};

userSchema.methods.generateToken = async function () {
  // new level 2
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "secret"); //OPTIONAL sign: #hash#, token LINE:B

  user.tokens.push({ token });

  await user.save();

  return token;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
