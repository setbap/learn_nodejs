const User = require("../models/user");

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	User.findById("5c5dc257a1597300f4e74c59")
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				res.redirect("/");
			});
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};
