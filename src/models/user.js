const validate = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: function (value) {
        if (!validate.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }, // This closing brace was missing
    },
    password: {
      type: String,
      required: true,
      validate: function (value) {
        if (value.length < 8) {
          throw new Error("Password is too short");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      validate: function (value) {
        if (value < 18) {
          throw new Error("Age must be greater than 18");
        }
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    skills: {
      type: [],
      required: true,
    },
    ImageUrl: {
      type: String,

      validate: {
        validator: function (value) {
          // Added options for URL validation
          const options = {
            protocols: ["http", "https"],
            require_protocol: true,
          };
          return validate.isURL(value, options);
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
