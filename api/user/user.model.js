const mongoose = require('mongoose');

// Define the Database model
const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    picture: {type: String},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    password: {type: String, required:true},
    job: {type: String},
    phone:{type: String},
    address:{type: String},
    websites: [{type:String}],
    city: {type: String},
    resume: {type: String},
    resetCode: String

})

module.exports = mongoose.model('User', userSchema);
