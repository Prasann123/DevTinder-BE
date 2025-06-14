const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connection } = require("mongoose");

requestsRouter.post(
  "/sendConnectionRequest/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const validStatus = ["interested", "rejected"];
      if (!validStatus.includes(status)) {
        res.status(400).send("Invalid status");
      }
      const findToUser = await User.findById(toUserId);
      if (!findToUser) {
        res.status(400).send("User not found");
      }

      const existingConnectionRequestCheck = await connectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequestCheck) {
        res.status(400).send("Connection request already exists");
      }

      const request = await new connectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const result = await request.save();
      res.json({ message: "Connection request sent successfully", result });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

requestsRouter.post(
  "/requests/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const validStatusCheck = ["accepted", "rejected"];

      const { status, requestId } = req.params;

      const currentUser = req.user;

      if (!validStatusCheck.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      console.log("Current User", currentUser._id);
      console.log("Request ID", requestId);
      console.log("Status", status);
      const findRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: currentUser._id,
        status: "interested",
      });

      if (!findRequest) {
        return res.status(400).send("Request not found");
      }

      findRequest.status = status;
      await findRequest.save();

      res.send(`${currentUser.firstName} has ${status} your request`);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestsRouter;
