"use client"

import React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import InterviewSetup from "./InterviewSetup"
import ActiveInterview from "./ActiveInterview"
import InterviewHistory from "./InterviewHistory"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { interviewApi } from "../lib/api"

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [pastInterviews, setPastInterviews] = useState([])
  const [userName, setUserName] = useState("")
  const [currentTab, setCurrentTab] = useState("setup")
  const [isInterviewLocked, setIsInterviewLocked] = useState(false)

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage instead of cookies
        const token = localStorage.getItem('token');

        if (!token) {
          console.log("No token found");
          navigate('/login');
          return;
        }

        // Basic token format validation
        if (!token.includes('.')) {
          console.error("Invalid token format");
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        try {
          // Verify token with backend
          const verifyResponse = await axios.get(
            "https://interviewai-backend-kkpk.onrender.com/api/v1/user/verify-token",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          
          // If verification fails, the catch block will handle it
          console.log("Token verified successfully");
          
          // Parse token for user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          const userId = payload.userid;
          
          const storedName = localStorage.getItem("userName");
          if (storedName) {
            setUserName(storedName);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('currentInterviewId');
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleStartInterview = async (generatedQuestionsWithAnswers, interviewId) => {
    if (generatedQuestionsWithAnswers && generatedQuestionsWithAnswers.length > 0) {
      // Extract just the question text for display
      const questionTexts = generatedQuestionsWithAnswers.map(q => q.question)
      
      // Store the full questions with answers
      setQuestions(generatedQuestionsWithAnswers)
      // Ensure we're setting a string, not an object
      setCurrentQuestion(questionTexts[0])
      setIsInterviewStarted(true)
      setCurrentQuestionIndex(0)
      
      // Switch to interview tab and lock it
      setCurrentTab("interview")
      setIsInterviewLocked(true)
      
      // Store the interview ID if provided
      if (interviewId) {
        localStorage.setItem('currentInterviewId', interviewId);
        console.log('Interview created with ID:', interviewId);
      }
      return
    }
    
    // If we have an interview ID but no questions, fetch them from the API
    const storedInterviewId = localStorage.getItem('currentInterviewId');
    if (storedInterviewId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://interviewai-backend-kkpk.onrender.com/api/v1/interview/interview/${storedInterviewId}/questions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        
        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
          // Ensure we're setting a string, not an object
          setCurrentQuestion(response.data.questions[0].question);
          setIsInterviewStarted(true);
          setCurrentQuestionIndex(0);
          return;
        }
      } catch (error) {
        console.error("Error fetching interview questions:", error);
        toast.error("Failed to fetch interview questions");
      }
    }
    
    // Fallback to hardcoded questions if no questions were provided or fetched
    const fallbackQuestions = [
      {
        question: "Tell me about your experience with React.js?",
        answer: "A strong answer would discuss specific React projects, components built, state management approaches used, and any performance optimizations implemented."
      },
      {
        question: "How do you handle state management in large applications?",
        answer: "A good answer would compare approaches like Redux, Context API, and React Query, discussing tradeoffs and when to use each approach."
      },
      {
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        answer: "A strong answer would describe a specific project, the technical challenges faced, the problem-solving approach, and the successful outcome."
      },
      {
        question: "How do you stay updated with the latest frontend technologies?",
        answer: "A good answer would mention specific resources like blogs, podcasts, conferences, and how the candidate applies new knowledge in practice."
      },
      {
        question: "What's your approach to writing clean, maintainable code?",
        answer: "A strong answer would discuss principles like DRY, SOLID, code reviews, testing strategies, and documentation practices."
      }
    ]
    
    setQuestions(fallbackQuestions)
    // Ensure we're setting a string, not an object
    setCurrentQuestion(fallbackQuestions[0].question)
    setIsInterviewStarted(true)
    setCurrentQuestionIndex(0)
  }

  const handleNextQuestion = (direction = 'next') => {
    if (direction === 'previous' && currentQuestionIndex > 0) {
      // Go to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Ensure we're setting a string, not an object
      setCurrentQuestion(questions[currentQuestionIndex - 1].question);
      setFeedback("");
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Ensure we're setting a string, not an object
      setCurrentQuestion(questions[currentQuestionIndex + 1].question);
      setFeedback("");
    } else if (direction === 'next' && currentQuestionIndex >= questions.length - 1) {
      // End of interview - complete the interview in the backend
      completeInterview();
    }
  }
  
  const completeInterview = async () => {
    const interviewId = localStorage.getItem('currentInterviewId');
    if (interviewId) {
      try {
        // Complete the interview
        const completeResponse = await interviewApi.completeInterview(interviewId);
        console.log("Interview completion response:", completeResponse);
        
        // Fetch the results to display
        const results = await interviewApi.getInterviewResults(interviewId);
        console.log("Interview results:", results);
        
        if (results.overallScore) {
          toast.success(`Interview completed! Overall score: ${results.overallScore.toFixed(1)}/10`);
          setFeedback(`Interview completed! Overall score: ${results.overallScore.toFixed(1)}/10`);
        } else {
          toast.success("Interview completed successfully!");
          setFeedback("Interview completed! Thank you for participating.");
        }

        // Clear the current interview ID
        localStorage.removeItem('currentInterviewId');
        
        // End interview mode and unlock tabs
        setIsInterviewStarted(false);
        setIsInterviewLocked(false);
        
        // Switch to history tab to show the completed interview
        setCurrentTab("history");
      } catch (error) {
        console.error("Error completing interview:", error);
        toast.error("Failed to complete interview. Please try again.");
      }
    }
  };

  const onEndInterview = async () => {
    try {
      await completeInterview();
    } catch (error) {
      console.error("Error in onEndInterview:", error);
      toast.error("Failed to end interview. Please try again.");
    }
  };

  const handleFeedback = (feedbackText) => {
    setFeedback(feedbackText)
  }
  const logoutHandler = async () => {
    try{
      const res=await axios.get('https://interviewai-backend-kkpk.onrender.com/api/v1/user/logout')
      if(res.data.success){
         // Clear all authentication data from localStorage
         localStorage.removeItem('token');
         localStorage.removeItem('userName');
         localStorage.removeItem('currentInterviewId');
         localStorage.removeItem('microphonePermissionGranted');
         
         toast.success(res.data.message)
         navigate('/login')
      }
    }
    catch(err){
       // Even if the server request fails, clear local storage and redirect
       localStorage.removeItem('token');
       localStorage.removeItem('userName');
       localStorage.removeItem('currentInterviewId');
       localStorage.removeItem('microphonePermissionGranted');
       
       toast.error(err.message || "Logged out due to an error");
       navigate('/login');
    }
   };
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-200 bg-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Mock Interview</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {userName || "Guest"}
            </span>
            <Button onClick={logoutHandler} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs value={currentTab} onValueChange={isInterviewLocked ? undefined : setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="setup" 
              disabled={isInterviewLocked}
            >
              Interview Setup
            </TabsTrigger>
            <TabsTrigger 
              value="interview" 
              disabled={!isInterviewStarted}
            >
              Active Interview
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              disabled={isInterviewLocked}
            >
              Past Interviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <InterviewSetup
              jobRole={jobRole}
              setJobRole={setJobRole}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              onStartInterview={handleStartInterview}
            />
          </TabsContent>

          <TabsContent value="interview">
            <ActiveInterview
              key={`question-${currentQuestionIndex}`}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              feedback={feedback}
              onProvideFeedback={handleFeedback}
              onNextQuestion={handleNextQuestion}
              onEndInterview={onEndInterview}
              expectedAnswer={questions[currentQuestionIndex]?.answer || ""}
              startInFullScreen={true}
            />
          </TabsContent>

          <TabsContent value="history">
            <InterviewHistory pastInterviews={pastInterviews} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
