const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const toUserExistsInDB = await User.findById(toUserId);
      if (!toUserExistsInDB) {
        return res.send("User not found");
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type");
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already exists");
      }
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  },
);

module.exports = requestRouter;
