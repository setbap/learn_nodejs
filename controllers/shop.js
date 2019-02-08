const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
	console.log(req.user);

	Product.find()
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch(() => console.log("err in get"));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch(() => console.log("err in get"));
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findById(productId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: "yah",
				path: "/products",
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log("getProduct"));
};

exports.getCart = (req, res, next) => {
	req.user
		.populate("cart.items.productId")
		.execPopulate()

		.then((user) => {
			// console.log();
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: user.cart.items,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch();
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
	const pid = req.body.productId;
	req.user
		.deleteFromCart(pid)
		.then(() => res.redirect("/cart"))
		.catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
	const pid = req.body.productId;
	// const items = [];
	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then((user) => {
			items = user.cart.items.map((i) => {
				return {
					product: { ...i.productId._doc },
					quantity: i.quantity,
				};
			});
			const order = Order({
				user: {
					name: req.user.name,
					userId: req.user._id,
				},
				items: items,
			});
			return order.save();
		})
		.then(() => req.user.clearCart())
		.then(() => res.redirect("/orders"));
};

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id }).then((orders) => {
		res.render("shop/orders", {
			path: "/orders",
			pageTitle: "Your Orders",
			orders,
			isAuthenticated: req.session.isLoggedIn,
		});
	});
};
