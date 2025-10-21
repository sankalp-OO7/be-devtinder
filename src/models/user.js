const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hobbies: { type: [String], default: [] },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      validate(v) {
        if (v.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
      },
    },
    role: { type: String, default: "user" },
    fotoURL: {
      type: String,
      default: "",
      max: [2048, "fotoURL length exceeded"],
      validate(v) {
        if (validator.isURL(v) === false) {
          throw new Error("Invalid URL for fotoURL" + v);
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (["male", "female", "other"].indexOf(value) === -1) {
          throw new Error("Gender must be 'male', 'female', or 'other'");
        }
      },
    },
    skills: {
      type: [String],
      default: [],
      validate(v) {
        if (v.length > 5) {
          throw new Error(
            "Skills cannot have more than 5 entries and you entered " + v.length
          );
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DevTinderUser", userSchema);
