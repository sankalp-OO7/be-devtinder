const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://racchewarsankalp:Redapple@cluster0.ghl4obu.mongodb.net/devTinder" ||
        "mongodb://localhost:27017/devTinder"
    );
    console.log("db got connected");
  } catch (err) {
    console.log("Database connection error:", err);
  }
};
module.exports = { dbConnect };
