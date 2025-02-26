const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const user = require("./models/user");

app.use(express.json());

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

app.patch("/updateUser", async (req, res) => {
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: data.userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.send("Updated data successfully");
  } catch (error) {
    res.send(500).send("Something went wrong" + error);
  }
});

app.post("/signup", async (req, res) => {
  /* const user = new User({
    firstName:"Prasanna",
    lastName:"Kumar",
    email:"prasanna@gmail.com",
    password:"password",
    age:20,
    gender:"Male"
}) */
  const user = new User(req.body);
  await user
    .save()
    .then((Result) => {
      res.send({
        message: "Data inserted successfully",
        data: Result,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
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
