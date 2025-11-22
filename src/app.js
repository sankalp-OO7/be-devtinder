const express = require("express");
const bcrypt = require("bcrypt");
const { dbConnect } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const feedRoutes = require("./routes/feed.js");
const User = require("./models/user.js");
app.use(express.json());
const { userAuth } = require("./middlewares/auth.js");
const jwt = require("jsonwebtoken");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend
    credentials: true, // allow cookies if used
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ avoid "Cannot parse Access-Control-Allow-Headers"
  })
);

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const connectionRoutes = require("./routes/connectionRequests.js");
const userConnection = require("./routes/userConnection.js");

let toDo = [
  {
    name: "Build a social networking app",
    tasks: [
      "User Authentication",
      "User Profiles",
      "Connection Requests",
      "Feed Generation",
    ],
    completed: true,
  },
  {
    name: "Set up database",
    tasks: ["Design Schemas", "Implement Models", "Database Connection"],
    completed: false,
  },
];

const validator = require("validator");
app.get("/test", async (req, res, next) => {
  res.status(200).json({ message: "API is working", toDo });
});
app.post("/test", (req, res) => {
  toDo = [...toDo, req.body];
  res.status(200).json({ message: "Added successfully", toDo });
});
app.use("/auth", authRoutes);
app.use("/userInfo", userRoutes);
app.use("/connectionRequest", userAuth, connectionRoutes);
app.use("/userConnections", userAuth, userConnection);
app.use("/feed", userAuth, feedRoutes);

dbConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started at port 3000 https://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to the database:", err);
  });
