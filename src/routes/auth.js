const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignupData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //creating a new instance of the user model
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });
    await newUser.save();
    res.send("User saved");
  } catch (err) {
    console.log("some error", err);
    res.send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      res.send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR!!" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});
module.exports = authRouter;
