const UserModel = require('./user.model');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');
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

// const update = async (user) => {
//     try{
//         const newUser =  await UserModel.findOneAndUpdate({_id:user._id}, user, {new:true});
//         return newUser;
//
//     }catch(e){
//         throw new Error('Unable to update an user');
//     }
// }

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

    const u = await UserModel.findOne({email}).lean()

    if (!u) {
        throw new Error('invalid email or password');
    }

    if (await bcrypt.compare(password, u.password)) {

        const token = jwt.sign({
                id: u._id,
                email: u.email
            },
            config.auth.jwtSecret
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


const validation = (user) => {
    const {email, firstname, lastname, password: plainTextPassword, confirmPassword: confirmPassword} = user;


    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || !email) {
        throw new Error('email not valid');
    }

    const error = checkPassword(plainTextPassword, confirmPassword);
    console.log(error);
    if (error.e) {
        throw new Error(error.message);
    }

    if (!(/^[a-zA-Z\s]+$/.test(firstname)) && !(/^[a-zA-Z\s]+$/.test(lastname))) {
        throw new Error("Your firstname and your lastname are not valid.");
    } else if (!(/^[a-zA-Z\s]+$/.test(firstname)) || !firstname) {
        throw new Error("Your firstname is not valid.");
    } else if (!(/^[a-zA-Z\s]+$/.test(lastname)) || !lastname) {
        throw new Error("Your lastname is not valid.");
    }
    return true;
}

const checkPassword = (password, confirmPassword) => {

    if (password.length < 2) {
        return {
            e: true,
            message: "Password too small. Should be at least 8 characters."
        };
    } else if (password !== confirmPassword) {
        return {
            e: true,
            message: "You need to enter the same password."
        };
    }
    return false;
}

module.exports = {
    add,
    //update,
    deleteById,
    getById,
    getAll,
    login,
    changePassword
}
