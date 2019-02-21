const express = require("express");
const { check } = require("express-validator/check");
const router = express.Router();
const authControllers = require("../controllers/auth");
const multer = require("multer");
router.get("/login", authControllers.getLogin);
router.get("/signup", authControllers.getSignup);

router.post(
	"/login",
	[
		// check("email")
		// 	.isEmail()
		// 	.withMessage("please enter valid email addres")
		// 	.normalizeEmail(),
		// check("password")
		// 	.isLength({ min: 2 })
		// 	.trim(),
	],
	authControllers.postLogin,
);
router.post("/logout", authControllers.postLogout);
router.post("/signup", authControllers.postSignup);

router.get("/reset-password", authControllers.getReset);

router.post("/reset-password", authControllers.postReset);

router.get("/reset/:code", authControllers.getNewPass);

router.post("/newPassword", authControllers.postNewPass);

module.exports = router;
