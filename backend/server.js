const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pinRoute = require("./routes/pins");

const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
console.log(uri);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongoose database connection was established succesfully");
});

app.use("/api/pins", pinRoute);

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
