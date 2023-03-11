const validator = require("validator");

const User = require("../models/userModel");
const Post = require("../models/postModel");

module.exports = {
  me() {
    return {
      name: "Adam",
      age: 18,
    };
  },

  createUser: async function ({ data }) {
    const { name, email, gender, password, age } = data;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      const error = new Error("Email already registered");
      throw error;
    }

    const user = new User({
      name,
      email,
      gender,
      age,
      password,
    });

    const savedUser = await user.save();
    return { ...savedUser._doc, id: savedUser._doc._id.toString() };
  },

  login: async function (args) {
    const { email, password } = args.data;

    const user = await User.findByCredentials(email, password);

    const token = await user.generateToken();

    return { id: user._id.toString(), token };
  },

  createPost: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Please authenticate");
      error.code = 401;
      error.state = "🔒";
      throw error;
    }

    const { title, body, imageUrl } = args.data;
    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: "Title is invalid." });
    }

    if (validator.isEmpty(body) || !validator.isLength(body, { min: 5 })) {
      errors.push({ message: "Body is invalid." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.date = errors;
      error.code = 422;

      throw error;
    }

    const post = new Post({
      title,
      body,
      imageUrl,
      owner: req.user,
    });

    await post.save();

    const postDoc = { id: post._id.toString(), ...post._doc };

    return { state: "🔑", ...postDoc };
  },

  posts: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Please authenticate");
      error.code = 401;
      error.state = "🔒";
      throw error;
    }

    const posts = await Post.find();

    return posts;
  },
};
