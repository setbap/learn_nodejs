const authed = require("../middleware/Authed");
const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", authed, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", authed, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", authed, adminController.postAddProduct);

// /admin/add-product => POST
router.post("/edit-product", authed, adminController.postEditProduct);

// /admin/add-product => POST
router.post("/delete-product", authed, adminController.postDelProduct);

// // /admin/edit-product => get
router.get("/edit-product/:prodId", authed, adminController.getEditProduct);

module.exports = router;
