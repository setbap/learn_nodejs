const path = require("path");
const dbPath = require("./util/db-path").db;
const secret = require("./util/db-path").sessionSecret;

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoSession = require("connect-mongodb-session")(session);
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const app = express();
const store = new mongoSession({
	uri: dbPath,
	collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
	session({
		secret,
		resave: false,
		saveUninitialized: false,
		store,
	}),
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
	.connect(dbPath)
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
	.catch((err) => console.log(err));
