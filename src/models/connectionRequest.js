const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["interested", "accepted", "rejected","ignored"],
        message: "${VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequest);
