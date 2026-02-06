const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a connection request");
  res.send("Connection request sent");
});

module.exports = requestRouter;
