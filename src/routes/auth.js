const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const User = require("../models/user");
const {validateUser} = require("../utils/validator");

authRouter.post("/Login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
  
      if (!user) {
        throw new Error("Invalid email or password");
      }
  
      const isPasswordValid = await user.validatePassword(password);
  
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      } else {
        const token = await user.getJWTToken();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.send("Login successfull");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  authRouter.post("/signup", async (req, res) => {
    try {
      validateUser(req.body);
      const {
        age,
        gender,
        ImageUrl,
        skills,
        password,
        email,
        firstName,
        lastName,
      } = req.body;
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        email,
        age,
        ImageUrl,
        skills,
        gender,
        password: passwordHash,
      });
      await user.save();
  
      res.send("User Saved successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  authRouter.post("/logout", async (req,res) => {
    res.clearCookie("token",{httpOnly: true});
    res.send("Logged out successfully");
  });


module.exports = authRouter;