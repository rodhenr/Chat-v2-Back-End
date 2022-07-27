const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller.js");
const { refreshToken } = require("../controllers/refreshToken.controller.js");
const { validation } = require("../middlewares/authValidator.middleware");
const {
  loginValidator,
  registerValidator,
} = require("../middlewares/validator.middleware");

router.route("/auth/login").post(loginValidator, validation, login);
router.route("/auth/register").post(registerValidator, validation, register);
router.route("/auth/refresh").get(refreshToken);

module.exports = router;
