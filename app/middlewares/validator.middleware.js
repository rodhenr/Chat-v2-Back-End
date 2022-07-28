const { check } = require("express-validator");

registerValidator = [
  check("email", "Por favor, inclua um e-mail válido")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("firstName", "O nome deve possuir 3 ou mais digitos")
    .notEmpty()
    .isLength({ min: 3 }),
  check("lastName", "O nome deve possuir 3 ou mais digitos")
    .notEmpty()
    .isLength({ min: 3 }),
  check("password", "A senha deve possuir 6 ou mais digitos").isLength({
    min: 6,
  }),
  check("confirmPassword", "As senhas devem ser iguais").custom(
    async (confirmPassword, { req }) => {
      const password = req.body.password;

      if (password !== confirmPassword) {
        throw new Error("As senhas devem ser iguais");
      }
    }
  ),
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
