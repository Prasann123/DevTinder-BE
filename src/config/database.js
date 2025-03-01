const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Prasanna:Password%40123@mongolearn.ytg3r.mongodb.net/DevTinder1"
  );
};

module.exports = connectDB;