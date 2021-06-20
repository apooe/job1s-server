const mongoose = require('mongoose');


// Define the Database model
const profileSchema = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true, unique: true},
    profileImg: {type: String},
    job: {type: String},
    description: {type: String},
    education:  [{collegeName: {type: String},
        degree:{type: String},
        startDate: {type: Date},
        endDate: {type: Date},
        link:{type: String}}],
    experience: [{companyName: {type: String},
                    position:{type: String},
                    startDate: {type: Date},
                    endDate: {type: Date},
                    description:{ type: String},
                    link:{type: String}}]

})

module.exports = mongoose.model('Profile', profileSchema);
