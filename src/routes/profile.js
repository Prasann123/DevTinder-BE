const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const { userUpdateValidation } = require("../utils/validator");
const { patch } = require("./auth");
const validate = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!userUpdateValidation(req.body)) {
      throw new Error("Invalid fields");
    }
    console.log(req.body);
    Object.keys(req.body).forEach(
      (update) => (user[update] = req.body[update])
    );
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, oldpassword } = req.body;
    const isPasswordValid = await user.validatePassword(oldpassword);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    if (!validate.isStrongPassword(password))
      throw new Error("Password is not strong enough");
    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    await user.save();
    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
