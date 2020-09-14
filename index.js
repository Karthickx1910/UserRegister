const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//import routes
const authRoute = require("./routes/auth");

//connect to DB
mongoose.connect(
  " mongodb+srv://demotest:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.vbh3b.mongodb.net/TestReg?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  function () {
    console.log("Connected to db");
  }
);
//middlewares
mongoose.Promise = global.Promise;
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

//route middlewares
app.use("/api/user", authRoute);

//server
app.listen(3000, function () {
  console.log("server 3000 is working");
});
