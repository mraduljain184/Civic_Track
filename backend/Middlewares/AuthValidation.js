const joi= require('joi');
const signupvalidation = (req, res, next) => {
    const schema = joi.object({
        username: joi.string().min(3).max(30).required(),
        phone: joi.number().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const loginvalidation = (req, res, next) => {
    const schema = joi.object({
        username: joi.string().min(3).max(30).required(),
        password: joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

module.exports = { signupvalidation, loginvalidation };