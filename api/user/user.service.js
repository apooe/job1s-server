const UserModel = require('./user.model');
const RecruiterModel = require('./user.model');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


const add = async (user) => {
    try {
        const {password: plainTextPassword} = user;
        user.password = await bcrypt.hash(plainTextPassword, 10)

        const userRecord = await UserModel.create(user);
        console.log('user created successfully');

        return userRecord;

    } catch (e) {
        if (e.code === 11000) {
            throw new Error("Email already in use");
        }
        throw new Error(e);
    }
}


const update = async (user) => {
    try {
        const newUser = await UserModel.findOneAndUpdate({_id: user._id}, user, {new: true});
        return newUser;

    } catch (e) {
        throw new Error('Unable to update an user');
    }
}

const deleteById = async (id) => {
    try {
        await UserModel.findOneAndDelete({_id: id});
        return true;

    } catch (e) {
        throw new Error('Unable to delete an user');
    }
}

const getById = async (id) => {
    try {
        const userRecord = await UserModel.findOne({_id: id});
        return userRecord;

    } catch (e) {
        throw new Error('Unable to get an user');
    }
}


const getAll = async (query = {}) => {
    try {
        const users = await UserModel.find(query); // The {} is reprensenting all (without filter)
        return users;
    } catch (e) {
        throw new Error('Unable to get all users.');
    }
}

const login = async (user) => {

    const {email, password} = user

    const userRecord = await UserModel.findOne({email}).lean();

    if (!userRecord) {
        throw new Error('invalid email or password');
    }

    if (await bcrypt.compare(password, userRecord.password)) {

        const token = jwt.sign({
                ...userRecord,
                password: undefined
            },
            config.auth.jwtSecret,
            {expiresIn: '24h'}
        )
        console.log('user login successfully', token)
        return {token};
    }
    throw new Error('invalid email or password');
}

const changePassword = async (user) => {

    const {token, newpassword: plainTextPassword, confirmPassword} = user

    const error = checkPassword(plainTextPassword, confirmPassword);
    if (error.e) {
        throw new Error(error.message);
    }

    try {
        const u = jwt.verify(token, config.auth.jwtSecret)
        const _id = u.id
        const password = await bcrypt.hash(plainTextPassword, 10)

        await UserModel.updateOne(
            {_id},
            {
                $set: {password}
            }
        )
        console.log("change password sucessfully");
        return true;

    } catch (e) {
        throw new Error('Unable to change password.');
    }
}

const sendFormToUser = async (form) => {

    console.log("je suis dans le service : ", form)

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'jobonesecond@gmail.com',
            pass: 'job1second2021'
        }
    }));

    const mailOptions = {
        from: 'jobonesecond@gmail.com',
        to: form.emailDest,
        subject: 'You received a message',
        html: `<p><strong>from:</strong> ${form.firstname} ${form.lastname}</p>
                <p><strong>Email: </strong> ${form.email}</p>
                <p><strong>Phone:</strong> ${form.phone}</p>
                <p><strong>Message:</strong> ${form.message}</p>
                `,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}


module.exports = {
    add,
    update,
    deleteById,
    getById,
    getAll,
    login,
    changePassword,
    sendFormToUser


}
