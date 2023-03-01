const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const post = new Post({ ...req.body });

    await post.save();

    res.json({
      sucessMessage: "Post created successfully..",
      post,
    });
  } catch (err) {
    console.log(err);
    // logger.error("Server",err)
    res.status(500).send();
    hkgjkhgljkhg;
  }
};

exports.deletePost = async (req, res) => {
  const owner = req.user._id; //OPTIONAL ___req.user._id___: #___User._id___#, ___res.user._id___ LINE:A

  const post = await Post.findOneAndDelete({ _id: req.params.id, owner });

  if (!post) {
    return res.status(404).send("Post Not Found!");
  }

  res.json({ sucessMessage: "Post deleted successfully..", post });
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user._id }); //OPTIONAL owner: #_id#, title LINE:B
    res.json({
      sucessMessage: "Post fetched successfully..",
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.updateMyPost = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowUpdates = ["title", "body"];

    const isVaildUpdate = updates.every((requiredUpdate) => //OPTIONAL every: #map#, concat LINE:A
      allowUpdates.includes(requiredUpdate)
    );

    if (!isVaildUpdate) {
      return res.status(400).send({ error: "Invaild Update" });
    }

    const owner = req.user._id;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, owner },
      { ...req.body },
      { new: true }
    );

    if (!post) {
      return res.status(404).send("Post Not Found!");
    }

    res.json({
      sucessMessage: "Post updated successfully..",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
