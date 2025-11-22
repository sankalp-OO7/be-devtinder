const express = require("express");
const userConnection = express.Router();
const Connections = require("../models/connections");
const { userAuth } = require("../middlewares/auth");

userConnection.get("/allRequests", userAuth, async (req, res) => {
  try {
    const connections = await Connections.find({
      toUserId: req.user._id,
      status: "intrested",
    }).populate("fromUserId", "name hobbies fotoURL skills gender");

    res.status(200).json({ messege: "data fetched successfully", connections });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

userConnection.get("/allConnections", userAuth, async (req, res) => {
  try {
    const connections = await Connections.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "name hobbies fotoURL skills gender")
      .populate("toUserId", "name hobbies fotoURL skills gender");

    res.status(200).json({
      messege: "data fetched successfully",
      connections,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = userConnection;
