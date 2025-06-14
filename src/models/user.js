const validate = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

      /*       validate: function (value) {
        if (value < 18) {
          throw new Error("Age must be greater than 18");
        }
      }, */
    },
    gender: {
      type: String,

      enum: ["Male", "Female"],
    },
    skills: {
      type: [],
    },
    ImageUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
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

userSchema.methods.getJWTToken = async function () {
  return jwt.sign({ _id: this._id }, "Dev@Tinder$700", { expiresIn: "1h" });
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
