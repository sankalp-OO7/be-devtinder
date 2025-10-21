const express = require("express");
const { dbConnect } = require("./config/database.js");
const { admincheck } = require("./middlewares/admincheck.js");
const app = express();
const User = require("./models/user.js");
app.use(express.json());

app.patch("/user/:id", async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "password",
      "role",
      "gender",
      "skills",
      "fotoURL",
      "hobbies",
    ];
    if (
      Object.keys(req.body).every((field) => allowedUpdates.includes(field))
    ) {
      if (req.body.hobbies.length > 6) {
        throw new Error(
          "Hobbies cannot have more than 6 entries and you entered " +
            req.body.hobbies.length
        );
      }
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
        res
          .status(200)
          .send(
            "user updated successfully from this " +
              userBefore +
              " to this " +
              updatedUser
          );
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

app.delete("/user", async (req, res) => {
  try {
    const user = req.body._id;
    const deletedUser = await User.findByIdAndDelete(user);
    if (!deletedUser) {
      return res.status(404).send("user not found");
    } else {
      res.status(200).send("user deleted successfully" + deletedUser);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/userById/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/userById", async (req, res) => {
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

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // console.log(user);
    res.status(201).send("user succesfully created : " + user);
    console.log("user created succesfully");
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).send("Internal Server Error" + err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    console.log(user);
    res.status(200).send(user);
  } catch (err) {
    console.log("Error fetching user:", err);
    res.status(500).send("Internal Server Error : " + err.message);
  }
});

app.use("/admin", admincheck);

app.get("/admin", (req, res) => {
  res.send("Hello from /admin endpoint");
});

app.post("/admin", (req, res) => {
  res.send("POST /admin received");
});

app.get("/admin/settings", (req, res) => {
  res.send("Hello from /admin/settings endpoint");
});
console.log(dbConnect);

dbConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started at port 3000 https://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to the database:", err);
  });
