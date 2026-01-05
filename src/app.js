const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.send("User saved");
  } catch (err) {
    console.log("some error");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("User not found");
    }
    res.send(users);
  } catch (error) {
    console.log("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userID;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted sucessfully");
  } catch (error) {
    console.log("Something went wrong", error);
  }
});

//update data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userID;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated sucessfully");
  } catch (error) {
    console.log("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected sucessfully");
    app.listen(8000, () => {
      console.log("server running on port 8000");
    });
  })
  .catch((err) => {
    console.log("fatal error");
  });
