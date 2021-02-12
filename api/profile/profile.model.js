const mongoose = require('mongoose');


// Define the Database model
const profileSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required:true, unique: true},
    profileImg: {type: String},
    dateOfBirth: {type: Date},
    gender: {type: Boolean},
    domain: {type: String},
    description: {type: String},
    education: {type: String},
    projects: {type: Array},
    status: {type: Boolean},
    experience: [{companyName: {type: String},
                    position:{type: String},
                    startDate: {type: Date},
                    endDate: {type: Date},
                    description:{ type: String}}]
})

module.exports = mongoose.model('Profile', profileSchema);
