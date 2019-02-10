const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		isAuthenticated: false,
	});
};

exports.getSignup = (req, res, next) => {
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email })
		.then((user) => {
			if (user) {
				bcrypt.compare(password, user.password).then((resault) => {
					if (resault) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							res.redirect("/");
						});
					} else {
						return res.redirect("/login");
					}
				});
			} else {
				return res.redirect("/signup");
			}
		})

		.catch((err) => {
			res.redirect("/login");
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email })
		.then((usr) => {
			if (!usr) {
				bcrypt.hash(password, 12).then((hp) => {
					const newUser = new User({
						password: hp,
						email,
						cart: {
							items: [],
						},
					});
					return newUser
						.save()
						.then((rslt) => res.redirect("/login"));
				});
			} else {
				return res.redirect("/signup");
			}
		})

		.catch((err) => console.log(err));
};
