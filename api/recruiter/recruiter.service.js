const RecruiterModel = require('./recruiter.model');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');


const add = async (recruiter) => {
    try {
        const {password: plainTextPassword} = recruiter;
        recruiter.password = await bcrypt.hash(plainTextPassword, 10)

        const recruiterRecord = await RecruiterModel.create(recruiter);
        console.log('recruiter created successfully');

        return recruiterRecord;

    } catch (e) {
        if (e.code === 11000) {
            throw new Error("Email already in use");
        }
        throw new Error(e);
    }
}


const update = async (recruiter) => {
    try {
        const newRecruiter = await RecruiterModel.findOneAndUpdate({_id: recruiter._id}, recruiter, {new: true});
        return newRecruiter;

    } catch (e) {
        throw new Error('Unable to update an recruiter profile');
    }
}

const deleteById = async (id) => {
    try {
        await RecruiterModel.findOneAndDelete({_id: id});
        return true;

    } catch (e) {
        throw new Error('Unable to delete an recruiter');
    }
}

const getById = async (id) => {
    try {
        const recruiterRecord = await RecruiterModel.findOne({_id: id});
        return recruiterRecord;

    } catch (e) {
        throw new Error('Unable to get an recruiter');
    }
}


const getAll = async (query = {}) => {
    try {
        const recruiters = await RecruiterModel.find(query); // The {} is reprensenting all (without filter)
        return recruiters;
    } catch (e) {
        throw new Error('Unable to get all recruiters.');
    }
}

const login = async (recruiter) => {

    // const {email, password} = recruiter
    //
    // const recruiterRecord = await RecruiterModel.findOne({email}).lean();
    //
    // if (!recruiterRecord) {
    //     throw new Error('invalid email or password');
    // }
    //
    // if (await bcrypt.compare(password, recruiterRecord.password)) {
    //
    //     const token = jwt.sign({
    //             ...recruiterRecord,
    //             password: undefined
    //         },
    //         config.auth.jwtSecret,
    //         {expiresIn: '24h'}
    //     )
    //     console.log('recruiter login successfully', token)
    //     return {token};
    // }
    // throw new Error('invalid email or password');
}

const changePassword = async (recruiter) => {

    const {token, newpassword: plainTextPassword, confirmPassword} = recruiter

    const error = checkPassword(plainTextPassword, confirmPassword);
    if (error.e) {
        throw new Error(error.message);
    }

    try {
        const u = jwt.verify(token, config.auth.jwtSecret)
        const _id = u.id
        const password = await bcrypt.hash(plainTextPassword, 10)

        await RecruiterModel.updateOne(
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

const uploadPicture = async (query = {}) => {
    try{

    }catch(e){
        throw new Error('Unable to get upload picture.');
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
    uploadPicture


}
