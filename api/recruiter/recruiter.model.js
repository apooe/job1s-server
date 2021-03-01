const mongoose = require('mongoose');


// Define the Database model
const recruiterSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    profileImg: {type: String},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    password: {type: String, required:true},
    jobPosts: [{companyName: {type: String},
        title:{type: String},
        location: {type: String},
        employment: {type: String},
        description:{ type: String},
        url:{type:String}}]
})

module.exports = mongoose.model('Recruiter', recruiterSchema);
