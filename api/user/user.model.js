const mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');

// Define the Database model
const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    picture: {type: String},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    password: {type: String, required:true},
    job: {type: String},
    phone:{type: mongoose.SchemaTypes.Phone},
    address:{type: String},
    websites: [{type:String}],
    city: {type: String},
    resume: {type: String},


})

module.exports = mongoose.model('User', userSchema);
