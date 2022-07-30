const express = require("express");
const router = express.Router();
const { getUserInfo, userChat } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken.middleware")

router.route("/chat").get(verifyToken, getUserInfo);
router.route("/chat/:id").get(verifyToken, userChat);

module.exports = router;
