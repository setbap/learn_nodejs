const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const myMail = require("../util/mail");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator/check");

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: myMail.user,
		pass: myMail.pass,
	},
});

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		err: req.flash("err"),
		isAuthenticated: false,
	});
};

exports.getReset = (req, res, next) => {
	res.render("auth/reset_pass", {
		path: "/reset",
		pageTitle: "Reset Password",
		err: req.flash("err"),
		errors: [],
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
	const errors = validationResult(req);
	console.log(errors.array());
	if (!errors.isEmpty()) {
		return res.status(422).render("auth/login", {
			path: "/login",
			pageTitle: "Login",
			err: errors.array()[0].msg,
			errors: errors.array(),
			isAuthenticated: false,
		});
	}

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
						return res.render("auth/login", {
							path: "/login",
							pageTitle: "Login",
							err: req.flash("err"),
							isAuthenticated: false,
						});
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
						resetTime: null,
						resetCode: null,
						cart: {
							items: [],
						},
					});
					return newUser.save().then((rslt) => {
						req.flash("err", "mail sent");
						res.redirect("/login");
						const msg = {
							to: email,
							from: myMail.user,
							subject: "Sending with SendGrid is Fun",
							text: "and easy to do anywhere, even with Node.js",
							html:
								"<strong>and easy to do anywhere, even with Node.js</strong>",
						};
						transporter.sendMail(msg, function(err, info) {
							if (err) console.log(err);
							// else console.log(info);
						});
					});
				});
			} else {
				req.flash("err", "invalid  email (maybe existing email)");
				return res.redirect("/signup");
			}
		})

		.catch((err) => console.log(err));
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex");
		const email = req.body.email;
		User.findOne({ email })
			.then((usr) => {
				if (usr) {
					usr.resetTime = Date.now() + 3600000;
					usr.resetCode = token;
					usr.save().then((resu) => {
						const mailOptions = {
							from: myMail.pass, // sender address
							to: email, // list of receivers
							subject: "Subject of your email", // Subject line
							html: `
									<p>You requested a password reset</p>
									<p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
          						`,
						};

						transporter.sendMail(mailOptions, function(err, info) {
							if (err) console.log(err);
							// else console.log(info);
						});

						res.redirect("/reset-password");
					});
				} else {
					req.flash(
						"err",
						`there is no user with this emial ${email} `,
					);
					res.render("auth/signup", {
						path: "/signup",
						pageTitle: "Signup",
						err: req.flash("err"),
						isAuthenticated: false,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});
};

exports.getNewPass = (req, res, next) => {
	resetCode = req.params.code;
	User.findOne({ resetCode, resetTime: { $gt: Date.now() } })
		.then((usr) => {
			if (usr) {
				console.log("yess");

				res.render("auth/newPassword", {
					path: "/newPassword",
					pageTitle: "new password",
					err: req.flash("err"),
					isAuthenticated: false,
					resetCode,
					id: usr._id.toString(),
				});
			} else {
				console.log("noo");
				res.redirect("/404");
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postNewPass = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const id = req.body.id;
	const resetCode = req.body.resetCode;
	User.findOne({
		email,
		_id: id,
		resetCode,
		resetTime: { $gt: Date.now() },
	}).then((usr) => {
		if (usr) {
			bcrypt.hash(password, 12, (err, hash) => {
				if (err) {
					return res.redirect("404");
				}
				usr.password = hash;
				usr.resetCode = null;
				usr.resetTime = null;
				usr.save().then(() => {
					req.flash("err", "pass changed");
					res.redirect("/login");
				});
			});
		} else {
			res.redirect("/login");
		}
	});
};
