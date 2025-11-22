const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DevTinderUser",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DevTinderUser",
    },
    status: {
      type: String,
      enum: ["ignored", "intrested", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Connections", connectionSchema);
