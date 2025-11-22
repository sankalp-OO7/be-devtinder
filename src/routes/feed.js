const express = require("express");
const { userAuth } = require("../middlewares/auth");
const feedRoutes = express.Router();
const Connections = require("../models/connections");
const User = require("../models/user");
const { set } = require("mongoose");

feedRoutes.get("/", userAuth, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 50;
    limit = limit > 50 ? 50 : limit;

    const skip = parseInt((req.query.page - 1) * limit) || 0;

    // 1. Find all user IDs involved in any existing connections or requests
    //    The user should not see:
    //    a) Anyone they have matched with (status: 'accepted')
    //    b) Anyone they have already sent a request to (fromUserId: req.user._id)
    //    c) Anyone who has already sent a request to them (toUserId: req.user._id)

    const connections = await Connections.find({
      $or: [
        // Case 1 & 2: User has sent a request (accepted or pending)
        { fromUserId: req.user._id },
        // Case 3: User has received a request (accepted or pending)
        { toUserId: req.user._id },
      ],
    }).select("fromUserId toUserId");

    // 2. Build a Set of all user IDs to exclude
    const excludedUserIds = new Set();

    // Always exclude the current logged-in user from the feed
    excludedUserIds.add(req.user._id.toString());

    connections.forEach((connection) => {
      // Add the ID of the *other* user in the connection/request
      if (connection.toUserId.toString() !== req.user._id.toString()) {
        excludedUserIds.add(connection.toUserId.toString());
      }
      if (connection.fromUserId.toString() !== req.user._id.toString()) {
        excludedUserIds.add(connection.fromUserId.toString());
      }
    });

    // 3. Query for Users that are NOT in the excludedUserIds Set
    const feedUsers = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    }).select("name gender email hobbies fotoURL skills age");
    // .skip(skip)
    // .limit(limit);

    res.send({ message: "Welcome to the feed!", feedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error: " + err.message);
  }
});

module.exports = feedRoutes;
