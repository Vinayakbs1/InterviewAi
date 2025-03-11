import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, History, Award, Calendar, Clock, Download, Loader, AlertCircle } from "lucide-react";
import { interviewApi } from "../lib/api";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function InterviewHistory() {
  const [pastInterviews, setPastInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchUserInterviews();
  }, []);

  const fetchUserInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        'https://interviewai-backend-kkpk.onrender.com/api/v1/interview/interviews',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("Fetched interviews:", response.data);
      setPastInterviews(response.data.interviews || []);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      toast.error("Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (interviewId) => {
    try {
      console.log("Viewing details for interview ID:", interviewId);
      setSelectedInterview(interviewId);
      setDetailsLoading(true);
      setIsDialogOpen(true);
      
      const details = await interviewApi.getInterviewResults(interviewId);
      console.log("Fetched interview details:", details);
      setInterviewDetails(details);
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
      toast.error("Failed to load interview details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not completed";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const getScoreColor = (score) => {
    if (typeof score !== 'number' || isNaN(score)) return "bg-gray-400";
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper function to determine if an interview is viewable
  const isInterviewViewable = (interview) => {
    console.log("Checking if interview is viewable:", interview);
    // An interview is viewable if it has been completed OR has a score
    return interview && (interview.isCompleted || interview.completedAt || interview.score !== 'Not completed');
  };

  // Export interview report as text file
  const handleExport = async () => {
    if (!interviewDetails) return;

    try {
      let reportContent = `INTERVIEW REPORT\n`;
      reportContent += `=================\n\n`;
      reportContent += `Job Role: ${interviewDetails.jobRole}\n`;
      reportContent += `Date: ${formatDate(interviewDetails.completedAt)}\n`;
      reportContent += `Overall Score: ${interviewDetails.overallScore ? interviewDetails.overallScore.toFixed(1) : 'N/A'}/10\n\n`;
      
      reportContent += `QUESTIONS AND ANSWERS\n`;
      reportContent += `=====================\n\n`;
      
      interviewDetails.questions.forEach((q, index) => {
        reportContent += `Question ${index + 1}: ${q.question}\n`;
        reportContent += `Your Answer: ${q.candidateAnswer || 'Not answered'}\n`;
        reportContent += `Score: ${q.aiEvaluation?.score ? q.aiEvaluation.score.toFixed(1) : 'N/A'}/10\n`;
        
        if (q.aiEvaluation?.feedback) {
          reportContent += `Feedback: ${q.aiEvaluation.feedback}\n`;
        }
        
        if (q.aiEvaluation?.strengths) {
          reportContent += `Strengths: ${q.aiEvaluation.strengths}\n`;
        }
        
        if (q.aiEvaluation?.areasForImprovement) {
          reportContent += `Areas for Improvement: ${q.aiEvaluation.areasForImprovement}\n`;
        }
        
        reportContent += `\n`;
      });
      
      // Create a blob and download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${formatDate(interviewDetails.completedAt).replace(/[/:\s]/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Interview History</CardTitle>
          <CardDescription>Review your past mock interviews and track your progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin mr-2" />
              <span>Loading interview history...</span>
            </div>
          ) : pastInterviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You haven't completed any interviews yet.</p>
              <p className="text-sm mt-2">Complete an interview to see your results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">{interview.jobRole}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {formatDate(interview.date)}</span>
                      </div>
                      {interview.completedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Completed: {formatDate(interview.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getScoreColor(interview.score)} text-white`}>
                      <Award className="mr-1 h-3 w-3" />
                      Score: {typeof interview.score === 'number' ? interview.score.toFixed(1) : "N/A"}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(interview.id)}
                      disabled={!isInterviewViewable(interview)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={fetchUserInterviews}>
            Refresh Interview History
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Report</DialogTitle>
            <DialogDescription>
              Review your interview performance and feedback
            </DialogDescription>
          </DialogHeader>
          
          {detailsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-8 w-8 animate-spin mr-2" />
              <span>Loading interview details...</span>
            </div>
          ) : interviewDetails ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{interviewDetails.jobRole}</h3>
                  <p className="text-gray-500">{formatDate(interviewDetails.completedAt)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <div className="text-2xl font-bold">{interviewDetails.overallScore ? interviewDetails.overallScore.toFixed(1) : 'N/A'}/10</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Performance Summary</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${getScoreColor(interviewDetails.overallScore)} text-white px-3 py-1 rounded-full flex items-center`}>
                    <Award className="mr-1 h-4 w-4" />
                    <div className="text-xl font-semibold">{interviewDetails.overallScore ? interviewDetails.overallScore.toFixed(1) : 'N/A'}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Questions Answered: {interviewDetails.totalQuestionsAnswered || 0}/{interviewDetails.totalQuestions || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Questions & Answers</h4>
                <div className="space-y-6">
                  {interviewDetails.questions.map((q, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">Question {index + 1}</h5>
                        <Badge className={`${getScoreColor(q.aiEvaluation?.score)} text-white`}>
                          {q.aiEvaluation?.score ? q.aiEvaluation.score.toFixed(1) : 'N/A'}/10
                        </Badge>
                      </div>
                      <p className="mb-2">{q.question}</p>
                      
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <h6 className="text-sm font-medium text-gray-500 mb-1">Your Answer:</h6>
                        <p className="text-gray-700">{q.candidateAnswer || "Not answered"}</p>
                      </div>
                      
                      {q.aiEvaluation && (
                        <div className="space-y-2">
                          <div>
                            <h6 className="text-sm font-medium text-gray-500">AI Feedback:</h6>
                            <p className="text-gray-700">{q.aiEvaluation.feedback || "No feedback provided"}</p>
                          </div>
                          
                          {q.aiEvaluation.strengths && (
                            <div>
                              <h6 className="text-sm font-medium text-green-600">Strengths:</h6>
                              <p className="text-gray-700">{q.aiEvaluation.strengths}</p>
                            </div>
                          )}
                          
                          {q.aiEvaluation.areasForImprovement && (
                            <div>
                              <h6 className="text-sm font-medium text-amber-600">Areas for Improvement:</h6>
                              <p className="text-gray-700">{q.aiEvaluation.areasForImprovement}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Failed to load interview details.</p>
              <p className="text-sm mt-2">Please try again later.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

