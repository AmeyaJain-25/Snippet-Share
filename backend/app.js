require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser"); //Helps to put or delete values in cookie
const cors = require("cors");

//Importing Routes
const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/post");
// const userRoutes = require("./routes/user");

//-----------------
//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//------------------
//ROUTES
app.use("/api", authRoutes);
// app.use("/api", postRoutes);
// app.use("/api", userRoutes);

//Heroku
app.get("/", (req, res) => {
  res.send("Hello to Api");
});

//------------------
//DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED"); //Message for succesful connection of database only after its connected
  })
  .catch(() => {
    console.log("OOOOOOOPPS DB DISCONNECTED");
  });

//------------------
//PORT
const port = process.env.PORT || 8000; //For keeping secure.  //Take port value from environment OR(||) Take default as 8000

//------------------
//STARTING A SERVER
app.listen(port, () => console.log(`App is Running at ${port}`));