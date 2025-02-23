const express = require("express");
const connectDB = require("./config/database");
const app = express();


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




