const userAuth = require("../middleware/userAuth");
const connectionRequest = require("../models/connectionRequest");
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

const USER_DATA = "firstName lastName ImageUrl age gender";
const USER_SAFE_DATA = "firstName lastName email age ImageUrl gender skills";
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    console.log(loggedinUser._id);
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedinUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_DATA);

    res.json({
      message: "Connection requests recieved",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedinUser._id, status: "accepted" },
          { toUserId: loggedinUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    console.log(connections);
    const data = await connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedinUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: "Connections",
      data: data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/requests/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedinUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Users",
      data: users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
