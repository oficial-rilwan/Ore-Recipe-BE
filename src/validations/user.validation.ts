import Joi from "joi";

class UserValidation {
  auth<T>(data: T) {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().min(6).max(55).required().label("Password"),
    });

    const { error } = schema.validate(data);
    if (error) return error.details[0].message;
    return null;
  }
  signup<T>(data: T) {
    const schema = Joi.object({
      firstName: Joi.string()
        .regex(new RegExp("^[\\p{L}\\p{N}\\s]+$", "u"), "First name must not contain special characters")
        .max(55)
        .required()
        .label("First Name"),
      lastName: Joi.string()
        .regex(new RegExp("^[\\p{L}\\p{N}\\s]+$", "u"), "Last name must not contain special characters")
        .max(55)
        .required()
        .label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().min(6).max(55).required().label("Password"),
    });

    const { error } = schema.validate(data);
    if (error) return error.details[0].message;
    return null;
  }
}
export default new UserValidation();
