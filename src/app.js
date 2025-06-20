const express = require("express");
const connectDB = require("./config/database");
const app = express();
const user = require("./models/user");

const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(express.json());
app.use(cookieparser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ email: userEmail });

    if (user.length == 0) {
      res.send(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.send(500).send("Something went wrong" + error);
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user is successfully deleted");
  } catch (error) {
    res.send(500).send("Something went wrong" + error);
  }
});

app.patch("/updateUser/", async (req, res) => {
  const userId = req.query.userId;
  const data = req.body;

  const validFields = [
    "firstName",
    "lastName",
    "gender",
    "skills",
    "password",
    "age",
  ];
  try {
    const keys = Object.keys(data).every((key) => validFields.includes(key));
    if (!keys) {
      throw new Error("Invalid fields");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.send("Updated data successfully");
  } catch (error) {
    res.status(400).send("Something went wrong" + error);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });

/* app.use("/", (req, res,next) => {
   // res.send("Welccome");
   console.log("Middleware 1");
    next();
  });
  app.use("/test", (req, res) => {
    res.send("Welcome to Dev tinder use");
  });
//this will only work with get http method alone
app.get("/test", (req, res) => {
    res.send("Welcome to Dev tinder get");
  });

  app.use("/test", (req, res) => {
    res.send("Welcome to Dev tinder use");
  });

//if we use use then this route will match all the http calls
app.use("/test1", (req, res,next) => {
  //res.send("Welcome to Dev tinder");
    next();
},(req,res,next) => {
    res.send("Welcome to Dev tinder2");
  });

app.use("/test/1", (req, res) => {
  res.send("Welcome to Dev tinder1 test");
}); */
