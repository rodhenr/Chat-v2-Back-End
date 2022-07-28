const express = require("express");
const router = express.Router();
const { getUserInfo } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken.middleware")

router.route("/chat").get(verifyToken, getUserInfo);

module.exports = router;
