const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { signupValidation } = require("../validations/userValidation");
const { userAuth } = require("../middlewares/auth");
authRoutes.post("/signup", async (req, res) => {
  try {
    const { name, email, password, gender, role } = req.body;
    signupValidation({ name, email, password, gender, role });
    const hashedPassward = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassward,
      gender,
      role,
    });

    const signedUser = await user.save();
    const token = await signedUser.getJWT();
    res.cookie("token", token);

    res
      .status(201)
      .send({ messege: "user created succesfully", userdata: signedUser });
    console.log("user created succesfully");
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).send({ messege: "Internal Server Error" + err });
  }
});

authRoutes.get("/user", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!userId) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log("Error fetching user data:", err);
    res.status(500).send("Error fetching user data: " + err);
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and Password are required");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user : " + email + " do not Exists");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).send({
        message: "user logged in succesfully",
        userdata: user,
      });
    } else {
      throw new Error("Passward is wrong");
    }
  } catch (err) {
    console.log("Error at login :", err);
    res.status(500).send("Error at login " + err);
  }
});

authRoutes.post("/logout", async (req, res) => {
  console.log(req.cookies);
  res.cookie("token", null);

  res.send("user Logged out ");
});
module.exports = authRoutes;
