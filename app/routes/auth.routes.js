const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller.js");
const { refreshToken } = require("../controllers/refreshToken.controller.js");

router.route("/auth/login").post(login);
router.route("/auth/register").post(register);
router.route("/auth/refresh").get(refreshToken);

module.exports = router;
