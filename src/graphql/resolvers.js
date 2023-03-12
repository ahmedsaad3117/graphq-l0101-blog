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
      owner: req.user._id,
    });

    await post.save();
    const postDoc = { id: post._id.toString(), ...post._doc };

    return postDoc;
  },

  posts: async function ({ page }, req) {
    if (!req.isAuth) {
      const error = new Error("Please authenticate");
      error.code = 401;
      error.state = "🔒";
      throw error;
    }
    const perPage = 2;
    if (!page) {
      page = 1;
    }

    const postsCount = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("owner")
      .skip((page - 1) * perPage)
      .limit(perPage);
    console.log(posts);

    return { postsCount, posts };
  },

  post: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Please authenticate");
      error.code = 401;
      error.state = "🔒";
      throw error;
    }

    const post = await Post.findOne({ _id: id }).populate("owner");

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    console.log(post);

    return {
      ...post._doc,
      _id: post._id.toString(),
    };
  },

  deletePost: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Please authenticate");
      error.code = 401;
      error.state = "🔒";
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized!");
      error.code = 403;
      throw error;
    }

    await Post.findByIdAndDelete(id);
    const user = await User.findById(req.user._id).populate("posts");
    console.log(user);
    user.posts.pull(id);

    await user.save();
    return true;
  },
};
