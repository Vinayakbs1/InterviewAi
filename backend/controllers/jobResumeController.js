import JobResume from "../db/models/JobResumeSchema.js";
import multer from "multer";
import path from "path";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// @desc Create a new Job & Resume entry
// @route POST /api/jobresume
// @access Public
export const createJobResume = async (req, res) => {
  try {
    const { jobRole, jobDescription, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const newJobResume = new JobResume({
      userId,
      jobRole,
      jobDescription,
      resume: {
        filename: req.file.filename,
        fileUrl: `/uploads/${req.file.filename}`, // Adjust based on cloud storage if needed
      },
    });

    await newJobResume.save();
    res.status(201).json({ message: "Job & Resume saved successfully", data: newJobResume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get all Job & Resume entries for a user
// @route GET /api/jobresume/:userId
// @access Public
export const getUserJobResumes = async (req, res) => {
  try {
    const { userId } = req.params;
    const jobResumes = await JobResume.find({ userId });

    if (!jobResumes.length) {
      return res.status(404).json({ error: "No records found for this user" });
    }

    res.status(200).json(jobResumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete a specific Job & Resume entry
// @route DELETE /api/jobresume/:id
// @access Public
export const deleteJobResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await JobResume.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json({ message: "Job & Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exporting multer upload middleware
export { upload };
