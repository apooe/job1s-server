const userService = require('./user.service');



const add = async (req, res, next) => {
    try {
        const user = req.body;
        const result = await userService.add(user);
        return res.status(201).json(result);
    }catch(e){
        next(e);
    }
}


const update = async (req, res, next) => {
    try {
        const user = req.body;
        const result = await userService.update(user);
        return res.status(200).json(result);
    }catch(e){
        next(e);
    }
}


const deleteById = async (req, res, next) => {
    try {
        const {id} = req.params;
        await userService.deleteById(id);
        return res.sendStatus(200);// Convert 200 to ok && set status to 200
    }catch(e){
        next(e);
    }
}

const getById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await userService.getById(id);
        return res.status(200).json(result);
    }catch(e){
        next(e);
    }
}




const getAll = async (req, res, next) => {
    try {
        const {q} = req.query;
        const query = req.query || q || {};
        const results = await userService.getAll(query);
        return res.status(200).json(results);
    }catch(e){
        next(e);
    }
}

const login = async (req, res, next) =>{

    try {
        const user = req.body;
        const {token} = await userService.login(user);
        return res.json({token});// Convert 200 to ok && set status to 200
    }catch(e){
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const {email} = req.params;
        const result = await userService.resetPassword(email);
        return res.status(200).json(result);
    }catch(e){
        next(e);
    }
}

const changePassword = async(req, res, next) => {
    try {
        console.log("ds controller")
        //const user = req.body;
        const {id} = req.params;
        const body = req.body;
        await userService.changePassword(id, body);
        return res.sendStatus(200);// Convert 200 to ok && set status to 200
    }catch(e){
        next(e);
    }
}

const checkCodeReset = async(req, res, next) => {
    try {
        const {code} = req.params;
        await userService.checkCodeReset(code.trim());
        return res.sendStatus(200);// Convert 200 to ok && set status to 200
    }catch(e){
        next(e);
    }
}


const sendFormToUser = async(req, res, next) => {

    try {
        const form = req.body;
        await userService.sendFormToUser(form);
        return res.sendStatus(200);
    }catch(e){
        next(e);
    }
}

const uploadResume = async (req,  res, next)=>{
    try {
        const {resumeFile} = req.query;
        const resume = await userService.uploadResume(resumeFile);
        return res.json(resume);
    }catch(e){
        next(e);
    }
}

const searchProfiles = async (req, res, next)=>{

    try {
        const {job} = req.query;
        const profiles = await userService.searchProfiles(job);
        return res.json(profiles);
    }catch(e){
        next(e);
    }
}

const jobSeekersMatch = async (req, res, next)=>{

    try {
        const {job} = req.query;
        const profiles = await userService.jobSeekersMatch(job);
        return res.json(profiles);
    }catch(e){
        next(e);
    }
}

const findCorrespondingUsers = async (req, res, next)=>{

    try {
        const relatedJobs = req.body;
        const profiles = await userService.findCorrespondingUsers(relatedJobs);
        return res.json(profiles);
    }catch(e){
        next(e);
    }
}




module.exports = {
    add,
    update,
    deleteById,
    getById,
    getAll,
    login,
    resetPassword,
    changePassword,
    sendFormToUser,
    uploadResume,
    searchProfiles,
    checkCodeReset,
    findCorrespondingUsers,
    jobSeekersMatch

}
