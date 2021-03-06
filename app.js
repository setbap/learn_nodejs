const path = require("path");
const dbPath = require("./util/db-path").db;
const secret = require("./util/db-path").sessionSecret;
const flash = require("connect-flash");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoSession = require("connect-mongodb-session")(session);
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const csurf = require("csurf");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, "sasd" + "-" + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const app = express();
const store = new mongoSession({
	uri: dbPath,
	collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");
app.use(flash());
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
const csrf = csurf();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(multer({ storage: storage, fileFilter }).single("image"));

app.use(csrf);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
	.connect(dbPath, { useNewUrlParser: true })
	.then(() => {
		console.log("conected");
		app.listen(5000);
	})
	.catch((err) => console.log(err));
