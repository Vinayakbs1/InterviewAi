import express from "express";
import { createJobResume, getUserJobResumes, deleteJobResume, upload } from "../controllers/jobResumeController.js";

const router = express.Router();

// Route to create a JobResume entry (with file upload)
router.post("/", upload.single("resume"), createJobResume);

// Route to get all JobResume entries for a user
router.get("/:userId", getUserJobResumes);

// Route to delete a JobResume entry
router.delete("/:id", deleteJobResume);

export default router;
