const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "sd"
  );
};

module.exports = connectDB;