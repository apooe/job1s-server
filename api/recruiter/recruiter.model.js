const mongoose = require("mongoose");

// Define the Database model
const recruiterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  profileImg: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  companyLink: { type: String },
  jobPosts: [
    {
      companyName: { type: String },
      title: { type: String },
      location: { type: String },
      employment: { type: String },
      description: { type: String },
      companyImg: { type: Boolean },
      relatedJobs: [{ type: String }],
      jobPostId: { type: String },
      url: { type: String },
    },
  ],
  resetCode: String,
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
