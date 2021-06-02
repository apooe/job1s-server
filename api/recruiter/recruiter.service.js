const RecruiterModel = require('./recruiter.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config');
const UserModel = require('../user/user.model');

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

}

const uploadPicture = async (query = {}) => {
    try{

    }catch(e){
        throw new Error('Unable to get upload picture.');
    }
}

const searchJobPosts = async (jobName) => {
    let jobQuery = {};
    console.log(jobName)
    const formattedJobName = jobName.trim().toLowerCase();

    if (jobName) { // jobPosts.title
        const relatedRegex = {'jobPosts.relatedJobs': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};
        const descriptionRegex = {'jobPosts.description': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};
        const locationRegex = {'jobPosts.location': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};
        const companyRegex = {'jobPosts.companyName': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};

        jobQuery = [relatedRegex, descriptionRegex, locationRegex, companyRegex];
    }

    try {
        const recruiters = await RecruiterModel.find({jobPosts: { $exists: true, $not: {$size: 0} }}).or(jobQuery);
        return recruiters.map(recruiter => {
            recruiter.password = undefined;
            recruiter.jobPosts = recruiter.jobPosts.filter(j =>
                j.description.toLowerCase().includes(formattedJobName) ||
                j.location.toLowerCase().includes(formattedJobName) ||
                j.companyName.toLowerCase().includes(formattedJobName) ||
                j.relatedJobs.find( r => r.toLowerCase().includes(formattedJobName))); //j.title.toLowerCase()
            return recruiter;
        });
    } catch (e) {
            throw new Error('Unable to get search `jobpost`');
    }
}


const findRelatedRecruiters = async (jobName) => {
    let jobQuery = {};
    console.log(jobName)
    const formattedJobName = jobName.trim().toLowerCase();

    if (jobName) { // jobPosts.title
        const relatedRegex = {'jobPosts.relatedJobs': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};
        const descriptionRegex = {'jobPosts.description': {$regex: `.*${formattedJobName}.*`, $options: 'i'}};


        jobQuery = [relatedRegex, descriptionRegex];
    }

    try {
        const recruiters = await RecruiterModel.find({jobPosts: { $exists: true, $not: {$size: 0} }}).or(jobQuery);
        return recruiters.map(recruiter => {
            recruiter.password = undefined;
            return recruiter;
        });
    } catch (e) {
        throw new Error('Unable to get related recruiters');
    }
}

const findRelatedJobSeeker = async (recruitedId) => {

    try{
        const recruiter = await RecruiterModel.findById(recruitedId).lean();
        // If not recruiter error svp
        const allRelatedJobs = recruiter.jobPosts?.reduce( (acc, jobPost) => {
            acc.push(...jobPost.relatedJobs);
            return acc;
        }, []);

        const userRelated = await UserModel.find({job: {$in: allRelatedJobs}}).lean();

        return userRelated.map(js => {
            js.password = undefined;
            return js;
        });

    }catch (e) {
        throw new Error('Unable to get corresponding job Seekers');
    }
}



module.exports = {
    add,
    update,
    deleteById,
    getById,
    getAll,
    login,
    findRelatedJobSeeker,
    uploadPicture,
    searchJobPosts,
    findRelatedRecruiters


}
