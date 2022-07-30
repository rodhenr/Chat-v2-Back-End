const express = require("express");
const router = express.Router();
const {
  sendMessage,
  addContact,
  mainChatInfo,
  userChatInfo,
} = require("../controllers/chat.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

router.route("/chat").get(verifyToken, mainChatInfo);
router.route("/chat/:contactId").get(verifyToken, userChatInfo);
router.route("/send").post(verifyToken, sendMessage);
router.route("/add").post(verifyToken, addContact);

module.exports = router;
