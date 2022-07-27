const { check } = require("express-validator");

registerValidator = [
  check("email", "Por favor, inclua um e-mail válido")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("username", "O nome de usuário deve possuir 5 ou mais digitos")
    .notEmpty()
    .isLength({ min: 5 }),
  check("password", "A senha deve possuir 6 ou mais digitos")
    .isLength({
      min: 6,
    })
    .equals("confirmPassword"),
];

loginValidator = [
  check("email", "Por favor, inclua um e-mail válido")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "A senha deve possuir 6 ou mais digitos").isLength({
    min: 6,
  }),
];

module.exports = {
  registerValidator,
  loginValidator,
};
