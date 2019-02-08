exports.getLogin = (req, res, next) => {
	console.log(req.get("Cookie").split("="));
	res.render("auth/login", {
		pageTitle: "login",
		path: "/login",
	});
};

exports.postLogin = (req, res, next) => {
	res.setHeader("Set-Cookie", "loggedIn=true");
	res.redirect("/");
};
