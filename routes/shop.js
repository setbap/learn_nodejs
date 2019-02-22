const express = require("express");
const authed = require("../middleware/Authed");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProduct);

router.get("/cart", authed, shopController.getCart);

router.post("/cart", authed, shopController.postCart);

router.post("/cart-delete-item", authed, shopController.postCartDeleteProduct);

router.post("/create-order", authed, shopController.postCreateOrder);

router.get("/orders", authed, shopController.getOrders);

router.get("/orders/factore/:factoreId", authed, shopController.getFactore);

// router.get("/createFake", shopController.fakeIt);

module.exports = router;
