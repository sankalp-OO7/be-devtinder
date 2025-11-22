const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const userRoutes = express.Router();

userRoutes.get("/userById", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

userRoutes.patch("/changePassward", userAuth, async (req, res) => {
  try {
    const updatedPassward = await bcrypt.hash(req.body.password, 10);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: updatedPassward,
      },
      { returnDocument: "after", runValidators: true }
    );
    const saved = user.password;
    const unsaved = await bcrypt.compare("newPassword1", saved);
    res.status(200).send({
      messege: "Password change successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" + err });
  }
});

userRoutes.patch("/updateProfile/:id", userAuth, async (req, res) => {
  try {
    console.log(req.user);
    const allowedUpdates = [
      "name",
      "age",
      "role",
      "gender",
      "skills",
      "fotoURL",
      "hobbies",
    ];
    const updates = Object.keys(req.body);
    if (
      Object.keys(req.body).every((field) => allowedUpdates.includes(field))
    ) {
      const user = req.body._id;

      const userBefore = await User.findById(req.params.id);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );
      console.log(updatedUser);
      if (!updatedUser) {
        return res.status(404).send("user not found");
      } else {
        res.status(200).send({
          userBefore: userBefore,
          updatedUser: updatedUser,
        });
      }
    } else {
      throw new Error(
        "Invalid updates! only " + allowedUpdates + " are allowed"
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Errorr" + err);
  }
});

module.exports = userRoutes;
