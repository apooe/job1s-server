const UserModel = require('./user.model');
const RecruiterModel = require('../recruiter/recruiter.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const smtpTransport = require('nodemailer-smtp-transport');
const AUTH_TYPE_RECRUITER = 'recruiter';
const AUTH_TYPE_JOB_SEEKER = 'job_seeker';

const add = async (user) => {
    try {
        const {password: plainTextPassword} = user;
        user.password = await bcrypt.hash(plainTextPassword, 10)

        const userRecord = await UserModel.create(user);
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
        return {token};
    }
    throw new Error('invalid email or password');
}

const resetPassword = async (email) => {

    const user = await UserModel.findOne({email}) || await RecruiterModel.findOne({email});
    if (!user) {
        throw new Error("Invalid email")
    }
    return await createCode(user);

}

const createCode = async (user) => {
    user.resetCode = crypto.randomBytes(4).toString("hex");
    await user.save();
    await sendCode(user);
    return user._id;
}

const changePassword = async (id, body) => {

    try {
        const {newPassword, confirmPassword} = body;
        await checkPassword(newPassword, confirmPassword);
        const user = await getById(id) || await RecruiterModel.findOne({_id: id});
        user.password = await bcrypt.hash(newPassword, 10);
        return await UserModel.findOneAndUpdate({_id: id}, user, {new: true}) ||
            await RecruiterModel.findOneAndUpdate({_id: id}, user, {new: true});

    } catch (e) {
        throw new Error(e.message);
    }

}
const checkPassword = async (newPassword, confirmPassword) => {

    if (!newPassword || !confirmPassword) {
        throw new Error('Please complete the fields');
    } else if (newPassword !== confirmPassword) {
        throw new Error('Please enter the same password');
    } else if (newPassword.length < 6) {
        throw new Error('The password must contain at least 6 characters');
    }

}

const checkCodeReset = async (code) => {
    const user = await UserModel.findOne({resetCode: code}) || await RecruiterModel.findOne({resetCode: code});
    if (!user) {
        throw new Error('Invalid code provided');
    }
    return true;
}

const sendCode = async (user) => {

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'jobonesecond@gmail.com',
            pass: 'job1second2021'
        }
    }));

    let htmlContent = `<h2>Hi ${user.firstname} ${user.lastname}, </h2>
                        <p>We recently received a request to recover the account ${user.email}.</p>
                        <p>Enter the code: <strong>${user.resetCode}</strong> to change your password.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <p>Thanks, </p>
                        <p>Team Job1second</p>`;
    const mailOptions = {
        from: 'jobonesecond@gmail.com',
        to: user.email,
        subject: 'Reset password for your account',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}
const sendFormToUser = async (form) => {

    let att = [];

    if(form.resume){

        let path = form.resume;
        let filename = path.split("/").pop();
        att = [
            {
                filename: filename,
                path: `../../code/ProjectHadassah/public/uploadsResume/${filename}`

            }
        ]
    }


    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'jobonesecond@gmail.com',
            pass: 'job1second2021'
        }
    }));

    let htmlContent = `<p><strong>from:</strong> ${form.firstname} ${form.lastname}</p>
                <p><strong>Email: </strong> ${form.email}</p>`;

    if (form.phone) {
        htmlContent += `<p><strong>Phone:</strong> ${form.phone}</p>`
    }

    if (form.message) {
        htmlContent += `<p><strong>Message:</strong> ${form.message}</p>`
    }

    let mailOptions = {
        from: 'jobonesecond@gmail.com',
        to: form.emailDest,
        subject: 'You received a message',
        html: htmlContent


    };

    if(form.resume){
        mailOptions['attachements'] = att;

    }

    console.log(mailOptions)

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error", error);
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
            return {relatedJobs: {$regex: `.*${word.trim()}.*`, $options: 'i'}}
        });
        jobQuery = {$or: jobRegexArray}
    }

    try {
        const users = await UserModel.find(jobQuery);
        console.log(users)
        return users.map(user => {
            user.password = undefined;
            return user;
        });
    } catch (e) {
        throw new Error('Unable to get profiles for this search');
    }
}

const jobSeekersMatch = async (jobName) => {
    console.log(jobName)
    let jobQuery = {};
    if (jobName) {
        const jobRegexArray = jobName.trim().split(' ').map(word => {
            return {job: {$regex: `.*${word.trim()}.*`, $options: 'i'}}
        });
        jobQuery = {$or: jobRegexArray}
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

    try {
        const users = await UserModel.find({job: relatedJobTitles});
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
    findCorrespondingUsers,
    checkCodeReset,
    resetPassword,
    jobSeekersMatch
}
