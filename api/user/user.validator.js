const Yup = require('yup');

const userValidator = Yup.object().shape({
    _id: Yup.string().optional().nullable(),
    email: Yup.string().email().required(),
    firstname: Yup.string().min(2).required(),
    lastname: Yup.string().min(2).required(),
    password: Yup.string().min(6).required(),
    job: Yup.string(),
    _v: Yup.number().optional().nullable()
});


module.exports = userValidator;
