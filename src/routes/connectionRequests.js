const express = require("express");
const connectionRoutes = express.Router();
const jwt = require("jsonwebtoken");
const Connections = require("../models/connections");

connectionRoutes.post("/:status/:toUserId", async (req, res) => {
  try {
    if (req.params.status != "ignored" && req.params.status != "intrested") {
      return res.status(400).send("Invalid status");
    }
    const tokenData = jwt.verify(req.cookies.token, "secreateKey");
    const { _id } = tokenData;

    const connectionExist = await Connections.findOne({
      $or: [
        { fromUserId: _id, toUserId: req.params.toUserId },
        { fromUserId: req.params.toUserId, toUserId: _id },
      ],
    });

    if (connectionExist) {
      return res
        .status(404)
        .send({ message: "Connection request already exist" });
    }
    if (_id === req.params.toUserId) {
      return res
        .status(404)
        .send({ message: "You cannot send connection request to yourself" });
    }

    const connection = new Connections({
      fromUserId: _id,
      toUserId: req.params.toUserId,
      status: req.params.status,
    });

    await connection.save();

    res.send({
      message: "Connection request " + req.params.status,
      connection: connection,
    });
  } catch (err) {
    res.status(500).send("internal server error" + err);
  }
});

connectionRoutes.post("/respond/:status/:toUserId", async (req, res) => {
  try {
    console.log(req.params.toUserId, req.user._id);
    if (req.params.status != "accepted" && req.params.status != "rejected") {
      return res.status(400).send({ message: "Invalid status" });
    }
    const connection = await Connections.findOne({
      $or: [
        { fromUserId: req.params.toUserId, toUserId: req.user._id },
        { fromUserId: req.user._id, toUserId: req.params.toUserId },
      ],
      status: "intrested",
    });

    if (!connection) {
      return res.status(404).send({ message: "No connection request found" });
    }
    console.log(connection);
    await connection.updateOne({ status: req.params.status });
    console.log(connection);

    res.send({
      message: "Connection request ",
      connection: connection,
    });
  } catch (err) {
    res.status(500).send({ message: "internal server error" + err });
    console.log(err);
  }
});

module.exports = connectionRoutes;
