const express = require("express");
const router = express.Router();
const { receiveMessage } = require("../controllers/chat.controller");

router.route("/chat/:id").post(receiveMessage)

module.exports = router;
