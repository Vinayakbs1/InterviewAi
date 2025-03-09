import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  originalQuestion: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  candidateAnswer: { type: String },
  audioTranscript: { type: String },
  aiEvaluation: { 
    score: { type: Number },
    feedback: { type: String },
    strengths: [{ type: String }],
    improvements: [{ type: String }]
  },
  answeredAt: { type: Date }
});

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  overallScore: { type: Number },
  overallFeedback: { type: String }
});

export default mongoose.model("Interview", InterviewSchema);
