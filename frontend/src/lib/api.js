import axios from 'axios';
import { API_ENDPOINTS } from './config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

export const interviewApi = {
  // Get all interviews for the current user
  getUserInterviews: async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.USER_INTERVIEWS,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user interviews:', error);
      throw error;
    }
  },

  // Get detailed results for a specific interview
  getInterviewResults: async (interviewId) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.INTERVIEW_BASE}/interview/${interviewId}/results`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching interview results:', error);
      throw error;
    }
  },

  // Complete an interview and get final score
  completeInterview: async (interviewId, overallFeedback = 'Interview completed successfully') => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.INTERVIEW_BASE}/interview/${interviewId}/complete`,
        { overallFeedback },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error completing interview:', error);
      throw error;
    }
  },
};