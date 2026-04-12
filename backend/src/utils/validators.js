import Joi from "joi";

const schemas = {
  userRegister: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
  }),
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  userUpdate: Joi.object({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  }),
  reviewCreate: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().min(5).max(100).required(),
    content: Joi.string().min(10).max(1000).required(),
  }),
  flightSearch: Joi.object({
    fromPlanetId: Joi.number().required(),
    toPlanetId: Joi.number().required(),
    departureDate: Joi.date().iso().required(),
    passengers: Joi.number().min(1).max(9),
  }),
  bookingCreate: Joi.object({
    flightId: Joi.number().required(),
    passengers: Joi.number().min(1).required(),
    seatSelectedIndices: Joi.array().items(Joi.number()),
  }),
  paymentProcess: Joi.object({
    bookingId: Joi.number().required(),
    stripeTokenId: Joi.string().required(),
  }),
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    throw { errors };
  }
  return value;
};

export { schemas, validate };
