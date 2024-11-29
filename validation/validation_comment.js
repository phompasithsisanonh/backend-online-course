const Joi = require("joi");

const commentValidationSchema = Joi.object({
  comment: Joi.string().min(1).max(500).required(),
});

module.exports = commentValidationSchema;
