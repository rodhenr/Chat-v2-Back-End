const { validationResult } = require("express-validator");

const validation = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.errors.length > 0)
    return res.status(400).json({
      error: errors.array().map((error) => error.msg),
    });

  next();
};

module.exports = {
  validation,
};
