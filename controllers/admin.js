const Product = require("../models/product");
const deleter = require("../util/delete_file");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		isAuthenticated: req.session.isLoggedIn,
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const image = req.file;
	// console.log("--------------------------", image);

	if (!image) {
		return res.redirect("/404");
	}
	const imageUrl = image.path;
	// const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product({
		description,
		price,
		title,
		imageUrl,
		userId: req.user,
	});
	product
		.save()
		.then((resualt) => {
			console.log("product created");
			res.redirect("/");
		})
		.catch((err) => console.log("postAddProduct"));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.prodId;
	const upTitle = req.body.title;
	const upPrice = req.body.price;
	const upImg = req.file;
	const upDesc = req.body.description;
	// const userId = req.user.id;

	// const product = new Product(upTitle, upPrice, upDesc, upImg, prodId)
	Product.findById(prodId)
		.then((prod) => {
			prod.title = upTitle;
			prod.price = upPrice;
			if (upImg) {
				deleter.deleteFile(prod.imageUrl);
				prod.imageUrl = upImg.path;
			}
			prod.description = upDesc;
			return prod.save();
		})
		.then(() => res.redirect("/admin/products"))
		.catch((err) => console.log("err in post edit"));
};

exports.deleteProduct = (req, res, next) => {
	const pid = req.params.pid;
	console.log("donw");

	Product.findById(pid)
		.then((prod) => {
			if (prod) {
				deleter.deleteFile(prod.imageUrl);
				return Product.findByIdAndDelete(pid).then((resualt) => {
					res.status(200).json({ message: "Success!", status: 200 });
				});
			} else {
				return res.status(500).json({ message: "Success!" });
			}
		})
		.catch(() => {
			res.status(500).json({ message: "Success!" });
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.prodId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Add Product",
				path: "/admin/edit-product",
				isAuthenticated: req.session.isLoggedIn,
				editing: true,
				product: product,
			});
		})
		.catch(() => console.log("err on edit prod"));
};

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.session.user._id }).then((products) => {
		res.render("admin/products", {
			prods: products,
			pageTitle: "Admin Products",
			isAuthenticated: req.session.isLoggedIn,
			path: "/admin/products",
		});
	});
};
