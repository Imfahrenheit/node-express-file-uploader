const express = require("express");

const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://TM:123456@ds227740.mlab.com:27740/shop-rest-api");

const uploadRoutes = require("./api/routes/uploads");

app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
// Our upload routes added here
app.use("/uploads", uploadRoutes);

app.use((req, res, next) => {
  const error = new Error("its all empty here");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message }
  });
});
module.exports = app;
