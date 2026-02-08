const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateEditProfileData } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Edit not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field]),
    );
    await loggedInUser.save();
    res.send(`${loggedInUser.firstName} Your Profile Was Updated Successfully`);
  } catch (error) {
    res.send(error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const loggedInUser = req.user;
  const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
  if (!isMatch) {
    return res.send("Incorrect old password");
  }
  const newPassword = req.body.newPassword;
  const isNewPasswordStrong = validator.isStrongPassword(newPassword);
  if (!isNewPasswordStrong) {
    res.send("Create a strong new password");
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  loggedInUser.password = passwordHash;
  await loggedInUser.save();
  res.send("Password Changed successfully");
});
module.exports = profileRouter;
