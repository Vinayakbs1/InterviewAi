import mongoose from "mongoose";

const JobResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  resume: {
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true } // Path or cloud storage URL
  },
  createdAt: { type: Date, default: Date.now }
});

const JobResume = mongoose.model("JobResume", JobResumeSchema);
export default JobResume;
