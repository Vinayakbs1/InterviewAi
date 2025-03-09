import Interview from '../db/models/interviewModel.js';
import User from '../db/models/user.js';

export const createInterview = async (req, res) => {
  try {
    const { 
      jobRole, 
      jobDescription, 
      questions 
    } = req.body;

    // Get user ID from authenticated request
    const userId = req.id;

    // Validate input
    if (!jobRole || !jobDescription || !questions) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Parse questions if it's a string
    const parsedQuestions = typeof questions === 'string' 
      ? JSON.parse(questions) 
      : questions;

    // Create interview record
    const interviewRecord = new Interview({
      userId,
      jobRole,
      jobDescription,
      questions: parsedQuestions.map(q => ({
        originalQuestion: q.question,
        correctAnswer: q.answer
      }))
    });

    // Save the record
    await interviewRecord.save();

    res.status(201).json({
      message: 'Interview created successfully',
      interviewId: interviewRecord._id,
      totalQuestions: interviewRecord.questions.length
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ 
      message: 'Failed to create interview',
      error: error.message 
    });
  }
};

// Method for updating interview question with audio transcript and AI evaluation
export const updateInterviewQuestion = async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.params;
    const { 
      audioTranscript,
      aiEvaluation 
    } = req.body;

    // Find and update the specific question
    const interviewRecord = await Interview.findOneAndUpdate(
      { 
        _id: interviewId, 
        [`questions.${questionIndex}`]: { $exists: true } 
      },
      {
        $set: {
          [`questions.${questionIndex}.audioTranscript`]: audioTranscript,
          [`questions.${questionIndex}.candidateAnswer`]: audioTranscript, // Set candidateAnswer to audioTranscript for backward compatibility
          [`questions.${questionIndex}.aiEvaluation`]: aiEvaluation,
          [`questions.${questionIndex}.answeredAt`]: new Date()
        }
      },
      { new: true }
    );

    if (!interviewRecord) {
      return res.status(404).json({ 
        message: 'Interview record or question not found' 
      });
    }

    res.status(200).json({
      message: 'Question updated successfully',
      question: interviewRecord.questions[questionIndex]
    });
  } catch (error) {
    console.error('Error updating interview question:', error);
    res.status(500).json({ 
      message: 'Failed to update interview question',
      error: error.message 
    });
  }
};

// Method to get interview questions
export const getInterviewQuestions = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ 
        message: 'Interview not found' 
      });
    }

    res.status(200).json({
      jobRole: interview.jobRole,
      jobDescription: interview.jobDescription,
      questions: interview.questions.map(q => ({
        question: q.originalQuestion,
        correctAnswer: q.correctAnswer
      }))
    });
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch interview questions',
      error: error.message 
    });
  }
};

// Method to get interview results
export const getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ 
        message: 'Interview not found' 
      });
    }

    // Check if user is authorized to view this interview
    if (interview.userId.toString() !== req.id) {
      return res.status(403).json({
        message: 'You are not authorized to view this interview'
      });
    }

    // Get answered questions
    const answeredQuestions = interview.questions.filter(q => q.aiEvaluation?.score);
    const totalScore = answeredQuestions.length > 0 
      ? answeredQuestions.reduce((sum, q) => sum + (q.aiEvaluation?.score || 0), 0) 
      : 0;
    const overallScore = answeredQuestions.length > 0 
      ? totalScore / answeredQuestions.length 
      : 0;

    // If interview is completed but doesn't have isCompleted flag, set it
    if (interview.completedAt && !interview.isCompleted) {
      interview.isCompleted = true;
      await interview.save();
    }

    res.status(200).json({
      jobRole: interview.jobRole,
      completedAt: interview.completedAt,
      overallScore: interview.overallScore || overallScore,
      isCompleted: interview.isCompleted || !!interview.completedAt,
      totalQuestionsAnswered: answeredQuestions.length,
      totalQuestions: interview.questions.length,
      questions: interview.questions.map(q => ({
        question: q.originalQuestion,
        candidateAnswer: q.candidateAnswer || "Not answered",
        aiEvaluation: q.aiEvaluation || { feedback: "Not evaluated", score: 0 }
      }))
    });
  } catch (error) {
    console.error('Error fetching interview results:', error);
    res.status(500).json({ 
      message: 'Failed to fetch interview results',
      error: error.message 
    });
  }
};

// Method to get all interviews for the current user
export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.id; // Get user ID from authenticated request
    
    // Find all interviews for this user
    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .select('jobRole jobDescription createdAt completedAt overallScore isCompleted'); // Added isCompleted to selected fields
    
    if (!interviews || interviews.length === 0) {
      return res.status(200).json({
        message: 'No interviews found for this user',
        interviews: []
      });
    }
    
    res.status(200).json({
      message: 'Interviews retrieved successfully',
      interviews: interviews.map(interview => ({
        id: interview._id,
        jobRole: interview.jobRole,
        date: interview.createdAt,
        completedAt: interview.completedAt,
        score: interview.overallScore || 'Not completed',
        isCompleted: interview.isCompleted // Use the isCompleted flag directly
      }))
    });
  } catch (error) {
    console.error('Error fetching user interviews:', error);
    res.status(500).json({
      message: 'Failed to fetch interviews',
      error: error.message
    });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { overallFeedback } = req.body;
    
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({ 
        message: 'Interview not found' 
      });
    }
    
    // Calculate overall score from answered questions
    const answeredQuestions = interview.questions.filter(q => q.aiEvaluation?.score);
    
    // Allow completion if at least one question is answered
    if (answeredQuestions.length === 0) {
      return res.status(400).json({
        message: 'At least one question must be answered before completing the interview'
      });
    }
    
    const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.aiEvaluation?.score || 0), 0);
    const overallScore = totalScore / answeredQuestions.length;
    
    // Update interview with completion details
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        overallScore,
        overallFeedback,
        completedAt: new Date(),
        isCompleted: true, // Set isCompleted to true
        totalQuestionsAnswered: answeredQuestions.length,
        totalQuestions: interview.questions.length
      },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Interview completed successfully',
      overallScore: updatedInterview.overallScore,
      completedAt: updatedInterview.completedAt,
      isCompleted: true,
      totalQuestionsAnswered: answeredQuestions.length,
      totalQuestions: interview.questions.length
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ 
      message: 'Failed to complete interview',
      error: error.message 
    });
  }
};