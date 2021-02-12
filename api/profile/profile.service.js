const ProfileModel = require('./profile.model');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');

const add = async (profil) => {
    try {

        const profile = profil;
        console.log(profile);
        const profileRecord = await ProfileModel.create(profile);
        console.log('profile created successfully');

        return profileRecord;

    } catch (e) {

        throw new Error(e);
    }
}

const update = async (profile) => {
    try{
        console.log("je sus ds update", profile);
        const newProfile=  await ProfileModel.findOneAndUpdate({_id:profile._id}, profile, {new: true});
        return newProfile;

    }catch(e){
        throw new Error('Unable to update an profile');
    }
}

const deleteById = async (id) => {
    try {
        await ProfileModel.findOneAndDelete({_id: id});
        return true;

    } catch (e) {
        throw new Error('Unable to delete a profile');
    }
}

const getById = async (id) => {
    try {
        const profileRecord = await ProfileModel.findOne({_id: id});
        return profileRecord;

    } catch (e) {
        throw new Error('Unable to get a profile by id');
    }
}
const getByUserId = async (id) => {
    try {

        const profileRecord = await ProfileModel.findOne({userId: id});
        return profileRecord;

    } catch (e) {
        throw new Error('Unable to get a profile by userId');
    }
}



const getAll = async (query = {}) => {
    try {
        const profiles = await ProfileModel.find(query); // The {} is reprensenting all (without filter)
        return profiles;
    } catch (e) {
        throw new Error('Unable to get all profiles.');
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
    getByUserId,
    getAll,
    uploadPicture
}
