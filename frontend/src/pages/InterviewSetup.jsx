import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { chatSession } from "../components/GeminiAiModel";
import { useState } from "react";

export default function InterviewSetup({
  jobRole,
  setJobRole,
  jobDescription,
  setJobDescription,
  resumeFile,
  setResumeFile,
  onStartInterview,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const extractPdfText = async (file) => {
    try {
      return new Promise((resolve, reject) => {
        pdfToText(file)
          .then((text) => {
            resolve(text);
          })
          .catch((error) => {
            console.error('PDF text extraction error:', error);
            reject(error);
          });
      });
    } catch (error) {
      console.error('File text extraction error:', error);
      throw error;
    }
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      toast.loading("Generating with AI...");
      
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please log in again.");
      
      // Decode JWT to extract user ID
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      const userId = payload.userid;
      
      if (!userId) throw new Error("User ID not found in token");

      // Extract text from resume
      let resumeText = '';
      try {
        resumeText = await extractPdfText(resumeFile);
      } catch (extractionError) {
        console.error('Resume text extraction failed:', extractionError);
        toast.error('Could not extract text from resume');
        setIsLoading(false);
        toast.dismiss();
        return;
      }

      // Generate Interview Questions Using Gemini AI
      const inputPrompt = `I want you to generate 10 interview questions based on the following details:

Job Position: ${jobRole}
Job Description: ${jobDescription}
Resume Text: ${resumeText}

Question Guidelines:
- Total Questions: 10
- 1 Introduction Questions
- 3 Project-related Questions
- 4 Technical Skill Questions (strictly based on skills in the resume and that skills that match with Job role and Job description)
- 2 Based on the Specifically On job role and job description(Even though skills in the resume doesn't match with job role and job description)
Provide both questions and answers in a JSON array format:
[
  {
    "question": "Your specific question here",
    "answer": "Detailed answer demonstrating technical knowledge"
  },
  ...
]`;

      // Send message to Gemini AI
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();

      // Extract JSON using regex
      const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON array found in the response");
      }

      // Clean and sanitize the JSON string before parsing
      let jsonResponsePart = jsonMatch[0];
      
      // Try to parse the JSON, with error handling
      let mockResponse;
      try {
        mockResponse = JSON.parse(jsonResponsePart.trim());
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        
        // Attempt to fix common JSON issues
        // Replace unescaped quotes within strings
        jsonResponsePart = jsonResponsePart.replace(/(?<!\\)"(?=[^"]*"\s*[:,}\]])/g, '\\"');
        
        // Try parsing again after fixing
        try {
          mockResponse = JSON.parse(jsonResponsePart.trim());
        } catch (secondError) {
          console.error("Second JSON parsing attempt failed:", secondError);
          throw new Error("Failed to parse AI response into valid JSON. Please try again.");
        }
      }
      
      // Log questions in console
      console.log(JSON.stringify(mockResponse, null, 2));

      // Save interview to database
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
      const response = await axios.post(
        `${API_BASE_URL}/interview/interview`,
        {
          jobRole,
          jobDescription,
          questions: mockResponse
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Get the interview ID from the response
      const interviewId = response.data.interviewId;
      
      toast.dismiss();
      toast.success("Interview setup completed successfully!");
      
      // Pass the generated questions with answers and the interview ID to the Dashboard component
      onStartInterview(mockResponse, interviewId);
    } catch (error) {
      console.error("Error setting up interview:", error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || error.message || "Failed to set up interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Your Mock Interview</CardTitle>
        <CardDescription>Provide details about the position you're applying for and upload your resume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-role">Job Role</Label>
          <Input
            id="job-role"
            placeholder="e.g. Frontend Developer, UX Designer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            className="min-h-[150px]"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume">Upload Resume</Label>
          <div className="flex items-center gap-2">
            <Input id="resume" type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            <Button variant="outline" onClick={() => document.getElementById("resume")?.click()} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {resumeFile ? resumeFile.name : "Select Resume"}
            </Button>
            {resumeFile && (
              <Button variant="ghost" onClick={() => setResumeFile(null)} size="sm">
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartInterview} 
          disabled={!jobRole || !jobDescription || !resumeFile || isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating with AI...
            </>
          ) : (
            "Start Mock Interview"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}