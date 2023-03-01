const UserModel = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const user = new UserModel({ ...req.body });

    await user.save();
    //const token = await user.generateToken(); //OPTIONAL generateToken(): #authenticate()#, token() LINE:A

    res.json({
      sucessMessage: "User created successfully..",
      user,
      //token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.json({
      sucessMessage: "Data fetched successfully..",
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    res.json({
      sucessMessage: "Data fetched successfully..",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gender } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { name, email, gender },
      {
        //OPTIONAL findOneAndUpdate: #put#, patch LINE:B
        new: true, //OPTIONAL true: #false#,  LINE:C
      }
    );

    res.json({
      sucessMessage: "Data updated successfully..",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gender } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { name, email, gender },
      {
        new: true,
      }
    );

    res.json({
      sucessMessage: "Data updated successfully..",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    await UserModel.findOneAndDelete({ _id: id });

    res.json({
      sucessMessage: "Data deleted successfully..",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.getUserPostsById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id }).populate("posts");

    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    res.json({
      sucessMessage: "Data fetched successfully..",
      posts: user.posts,
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateToken();

    res.send({ user, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
