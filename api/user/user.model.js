const mongoose = require('mongoose');

// Define the Database model
const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    password: {type: String, required:true}

})

module.exports = mongoose.model('User', userSchema);