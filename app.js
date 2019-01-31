const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("5c51f6a9e34dcb44f84a529d")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => console.log("err in use in user"));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb://sina:sina1234@ds024548.mlab.com:24548/node_db")
  .then(() => {
    // const user = new User({
    //   name: "sina",
    //   email: "ebr.sina@gmail.com",
    //   cart: {
    //     items: []
    //   }
    // });
    // user.save();
    console.log("conected");
    app.listen(5000);
  })
  .catch(err => console.log(err));
