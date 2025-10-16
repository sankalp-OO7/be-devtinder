const express = require("express");
const app = express();

app.use("/user", (req, res, next) => {
  res.send("hello from user route");
});
app.use("/", (req, res, next) => {
  res.send("hello from server on port 3000");
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
