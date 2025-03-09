import express from 'express';
import { 
  createInterview, 
  updateInterviewQuestion,
  getInterviewQuestions,
  getInterviewResults,
  completeInterview,
  getUserInterviews
} from '../controllers/interviewController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Create new interview
router.post('/interview', isAuthenticated, createInterview);

// Get interview questions
router.get('/interview/:interviewId/questions', isAuthenticated, getInterviewQuestions);

// Update a specific interview question
router.patch('/interview/:interviewId/question/:questionIndex', isAuthenticated, updateInterviewQuestion);

// Get interview results
router.get('/interview/:interviewId/results', isAuthenticated, getInterviewResults);

// Complete interview and calculate final score
router.post('/interview/:interviewId/complete', isAuthenticated, completeInterview);

// Get all interviews for the current user
router.get('/user-interviews', isAuthenticated, getUserInterviews);

export default router;