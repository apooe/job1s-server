const UserModel = require('./user.model');
const RecruiterModel = require('../recruiter/recruiter.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const AUTH_TYPE_RECRUITER = 'recruiter';
const AUTH_TYPE_JOB_SEEKER = 'job_seeker';

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
        return users.map(user => {
            user.password = undefined;
            return user;
        });
    } catch (e) {
        throw new Error('Unable to get all users.');
    }
}

const login = async (user) => {

    const {email, password} = user;
    let userType = AUTH_TYPE_JOB_SEEKER;

    let userRecord = await UserModel.findOne({email}).lean();

    if (!userRecord) {
        userRecord = await RecruiterModel.findOne({email}).lean();
        userType = AUTH_TYPE_RECRUITER;
        if (!userRecord) {
            throw new Error('invalid email or password');
        }
    }

    if (await bcrypt.compare(password, userRecord.password)) {

        const token = jwt.sign({
                ...userRecord,
                password: undefined,
                userType
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
    let path = form.resume;
    let filename = path.split("/").pop();
    console.log(filename)


    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'jobonesecond@gmail.com',
            pass: 'job1second2021'
        }
    }));

    let htmlContent = `<p><strong>from:</strong> ${form.firstname} ${form.lastname}</p>
                <p><strong>Email: </strong> ${form.email}</p>
                <p><strong>Phone:</strong> ${form.phone}</p>`;

    if (form.message) {
        htmlContent += `<p><strong>Message:</strong> ${form.message}</p>`
    }

    const mailOptions = {
        from: 'jobonesecond@gmail.com',
        to: form.emailDest,
        subject: 'You received a message',
        html: htmlContent,
        attachments: [
            {
                filename: filename,
                path: `../../code/ProjectHadassah/public/uploadsResume/${filename}`

            }
        ]

    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("errrrrrrror", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const uploadResume = async (query = {}) => {
    try {
    } catch (e) {
        throw new Error('Unable to get upload resume.');
    }
}

const searchProfiles = async (jobName) => {
    let jobQuery = {};
    if (jobName) {
        const jobRegexArray = jobName.trim().split(' ').map(word => {
            return {job: {$regex: `.*${word.trim()}.*`, $options: 'i'}}
        });
        jobQuery = {$or: jobRegexArray}
        console.log(jobQuery);
    }

    try {
        const users = await UserModel.find(jobQuery);
        return users.map(user => {
            user.password = undefined;
            return user;
        });
    } catch (e) {
        throw new Error('Unable to get search users');
    }
}

const findCorrespondingUsers = async (relatedJobTitles) => {

    console.log(relatedJobTitles);

    try {
        const users = await UserModel.find({job :relatedJobTitles });
        console.log(users)
        return users.map(user => {
            user.password = undefined;
            return user;
        });


    } catch (e) {
        throw new Error('Unable to get  profiles of users');
    }
}


module.exports = {
    add,
    update,
    deleteById,
    getById,
    getAll,
    login,
    changePassword,
    sendFormToUser,
    uploadResume,
    searchProfiles,
    findCorrespondingUsers


}
