const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
	"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",
);

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		err: req.flash("err"),

		isAuthenticated: false,
	});
};

exports.getSignup = (req, res, next) => {
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		err: req.flash("err"),
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
						req.flash("err", "invalid password or email");
						return res.redirect("/login");
					}
				});
			} else {
				req.flash("err", "invalid password or email");
				return res.redirect("/login");
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
					return newUser.save().then((rslt) => {
						req.flash("err", "mail sent");
						res.redirect("/login");
						const msg = {
							to: email,
							from: "test@example.com",
							subject: "Sending with SendGrid is Fun",
							text: "and easy to do anywhere, even with Node.js",
							html:
								"<strong>and easy to do anywhere, even with Node.js</strong>",
						};
						sgMail
							.send(msg)
							.then((resu) => console.log("resu"))
							.catch((resu) => console.log(resu));
					});
				});
			} else {
				req.flash("err", "invalid  email (maybe existing email)");
				return res.redirect("/signup");
			}
		})

		.catch((err) => console.log(err));
};
