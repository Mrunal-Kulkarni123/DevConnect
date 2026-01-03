const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Hermione",
    lastName: "Granger",
    age: 19,
    gender: "female",
  });

  await user.save();
  res.send("data saved sucessfully to database");
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
