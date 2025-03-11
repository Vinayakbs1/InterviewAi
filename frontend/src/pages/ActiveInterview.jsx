"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Mic, Loader, X, ChevronLeft, ChevronRight } from "lucide-react"
import { chatSession } from "../components/GeminiAiModel"
import { toast } from "react-hot-toast"
import Webcam from "react-webcam"
import axios from "axios"
import useSpeechToText from "react-hook-speech-to-text"

export default function ActiveInterview({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  feedback,
  onProvideFeedback,
  onNextQuestion,
  onEndInterview,
  expectedAnswer,
  startInFullScreen = false,
}) {
  const [isFullScreen, setIsFullScreen] = useState(startInFullScreen)
  const [webcamEnabled, setWebcamEnabled] = useState(startInFullScreen)
  const webcamRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [currentSessionTranscript, setCurrentSessionTranscript] = useState("") // Store current session transcript
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)
  
  // Ensure currentQuestion is always a string
  const questionText = typeof currentQuestion === 'object' ?
     (currentQuestion.question || 'No question available') :
     (currentQuestion || 'No question available')
  
  // Request microphone permission on component mount
  useEffect(() => {
    const checkStoredPermission = () => {
      // Check if permission was already granted in this session
      const storedPermission = localStorage.getItem('microphonePermissionGranted');
      if (storedPermission === 'true') {
        console.log("Microphone permission already granted in this session");
        setPermissionGranted(true);
        return true;
      }
      return false;
    };
    
    const requestMicrophonePermission = async () => {
      // If permission was already granted, don't show the toast again
      if (checkStoredPermission()) {
        return;
      }
      
      try {
        setIsRequestingPermission(true);
        toast.loading("Please allow microphone access when prompted", { duration: 5000 });
        console.log("Requesting microphone permission...");
        
        // Force a permission dialog by creating a new audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create a dummy audio source to ensure permission dialog appears
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(audioContext.destination);
        
        // Store permission in localStorage
        localStorage.setItem('microphonePermissionGranted', 'true');
        setPermissionGranted(true);
        toast.success("Microphone access granted!");
        
        // Stop the stream after getting permission
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Error requesting microphone permission:", err);
        toast.error("Microphone access denied. Please enable it in your browser settings.");
        localStorage.setItem('microphonePermissionGranted', 'false');
        setPermissionGranted(false);
      } finally {
        setIsRequestingPermission(false);
      }
    };
    
    // Only request permission if not already granted
    if (!checkStoredPermission()) {
      requestMicrophonePermission();
    }
  }, []);
  
  // Add a useEffect to clear transcript when question changes
  useEffect(() => {
    // Clear transcript when question changes
    setTranscript("")
    setCurrentSessionTranscript("")
    console.log("Question changed, cleared transcript")
  }, [currentQuestionIndex, currentQuestion])
  
  // Initialize full-screen mode when component mounts
  useEffect(() => {
    if (startInFullScreen) {
      setIsFullScreen(true)
      setWebcamEnabled(true)
      console.log("Starting interview in full-screen mode")
    }
  }, [startInFullScreen])
  
  // Set up speech recognition using react-hook-speech-to-text
  const {
    error,
    interimResult,
    isRecording: isSpeechRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    resetTranscript
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: 'en-US',
      interimResults: true,
      maxAlternatives: 1
    },
    crossBrowser: true,
    timeout: 30000, // Increased timeout for better recognition
    audioContext: { // Provide custom audio context settings
      sampleRate: 48000,
      channelCount: 1
    }
  })

  // Update transcript when results change
  useEffect(() => {
    if (results && results.length > 0) {
      const transcriptText = results.map(result => result.transcript).join(' ')
      console.log("Speech recognition results:", results)
      console.log("Updated transcript:", transcriptText)
      setTranscript(transcriptText)
      setCurrentSessionTranscript(transcriptText) // Save current session transcript
    }
  }, [results])

  // Handle errors from speech recognition
  useEffect(() => {
    if (error) {
      console.error("Speech recognition error:", error)
      toast.error("Speech recognition error: " + error.message)
    }
  }, [error])

  const handleRecordToggle = async () => {
    if (!isRecording) {
      // Check if permission is granted
      if (!permissionGranted) {
        // Check localStorage first
        const storedPermission = localStorage.getItem('microphonePermissionGranted');
        if (storedPermission === 'true') {
          console.log("Using stored microphone permission");
          setPermissionGranted(true);
        } else {
          try {
            setIsRequestingPermission(true);
            toast.loading("Please allow microphone access when prompted", { duration: 5000 });
            console.log("Requesting microphone permission before recording...");
            
            // Force a permission dialog by creating a new audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: true,
              video: false
            });
            
            console.log("Microphone permission granted, stream obtained:", stream.id);
            
            // Create a dummy audio source to ensure permission dialog appears
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(audioContext.destination);
            
            // Store permission in localStorage
            localStorage.setItem('microphonePermissionGranted', 'true');
            setPermissionGranted(true);
            toast.success("Microphone access granted!");
            
            // Stop the stream after getting permission
            stream.getTracks().forEach(track => track.stop());
          } catch (err) {
            console.error("Error requesting microphone permission:", err);
            toast.error("Microphone access denied. Please enable it in your browser settings and refresh the page.");
            localStorage.setItem('microphonePermissionGranted', 'false');
            return;
          } finally {
            setIsRequestingPermission(false);
          }
        }
      }
      
      // Start recording
      setIsRecording(true)
      // Clear previous transcripts for this question
      setTranscript("")
      setCurrentSessionTranscript("")
      
      try {
        console.log("Starting speech recognition for question", currentQuestionIndex + 1)
        // Start speech recognition
        await startSpeechToText()
        toast.success("Recording started! Speak clearly into your microphone.")
      } catch (error) {
        console.error("Error starting recording:", error)
        toast.error("Failed to start recording. Please check your browser permissions.")
        setIsRecording(false)
      }
    } else {
      // Stop recording
      setIsRecording(false)
      
      try {
        // Save the current transcript before stopping the speech recognition
        const savedTranscript = transcript
        console.log("Saved transcript for question", currentQuestionIndex + 1, ":", savedTranscript)
        
        // Only proceed if there's something to process
        if (savedTranscript && savedTranscript.trim()) {
          setIsProcessing(true)
          
          // Stop speech recognition
          await stopSpeechToText()
          
          // Process the saved transcript and get AI feedback
          await processTranscriptWithAI(savedTranscript)
        } else {
          toast.error("No speech detected. Please try again.")
          // Stop speech recognition but don't process
          await stopSpeechToText()
        }
      } catch (error) {
        console.error("Error stopping recording:", error)
        toast.error("Failed to process recording.")
        setIsProcessing(false)
      }
    }
  }

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    setWebcamEnabled(!isFullScreen) // Enable webcam when entering full screen
  }

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // This will be handled by the parent component
      onNextQuestion('previous')
    }
  }

  // Process transcript with AI for evaluation and save to backend
  const processTranscriptWithAI = async (savedTranscript) => {
    try {
      // Use the saved transcript to prevent issues with empty transcripts
      const textToProcess = savedTranscript.trim()
      
      if (!textToProcess) {
        toast.error("No speech detected. Please try again.")
        setIsProcessing(false)
        return
      }

      // Log the transcript being processed to help with debugging
      console.log("Processing transcript for question", currentQuestionIndex + 1, ":", textToProcess)
      
      // Prepare prompt for Gemini AI to evaluate the answer
      const evaluationPrompt = `You are an expert interviewer evaluating a candidate's response to a job interview question avoid grammer mistakes because transcript is not that good.

Question: ${questionText}

Candidate's Answer: ${textToProcess}

Expected Answer Elements: ${expectedAnswer || 'Not provided'}

Please evaluate the answer and provide feedback in the following JSON format:
{
  "score": [number between 1-10],
  "feedback": "Overall assessment of the answer",
  "strengths": ["Strength 1", "Strength 2", ...],
  "improvements": ["Area for improvement 1", "Area for improvement 2", ...]
}`;
      
      // Send to Gemini AI for evaluation
      const response = await chatSession.sendMessage(evaluationPrompt);
      console.log("Raw Gemini response:", response);
      
      // Access the text directly from the response object
      const responseText = response.response ? response.response.text() : response.text;
      
      console.log("Response text:", responseText);
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      const jsonResponsePart = jsonMatch[0];
      const evaluation = JSON.parse(jsonResponsePart.trim());
      // Format feedback for display
      const formattedFeedback = `Score: ${evaluation.score}/10\n\n${evaluation.feedback}\n\nStrengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`;
      
      // Save the answer and evaluation to the backend
      const interviewId = localStorage.getItem('currentInterviewId');
      console.log("Current interview ID:", interviewId);
      console.log("Current question index:", currentQuestionIndex);
      
      if (interviewId) {
        try {
          const token = localStorage.getItem('token');
          console.log("Token available:", !!token);
          
          // Change this line in the processTranscriptWithAI function
const apiUrl = `https://interviewai-backend-kkpk.onrender.com/api/v1/interview/interview/${interviewId}/question/${currentQuestionIndex}`;
          console.log("API URL:", apiUrl);
          
          const requestData = {
            audioTranscript: textToProcess, // Use the processed transcript for this specific question
            aiEvaluation: evaluation
          };
          console.log("Request data:", requestData);
          
          const response = await axios.patch(
            apiUrl,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              withCredentials: true,
            }
          );
          
          console.log('API response:', response.data);
          console.log('Answer saved to backend successfully for question', currentQuestionIndex + 1);
        } catch (apiError) {
          console.error('Failed to save answer to backend:', apiError);
          console.error('Error details:', apiError.response ? apiError.response.data : 'No response data');
          // Continue with local feedback even if API call fails
        }
      } else {
        console.warn("No interview ID found in localStorage, skipping backend save");
      }
      
      // Update feedback
      onProvideFeedback(formattedFeedback);
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.error("Failed to evaluate your answer");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Card className={`${isFullScreen ? 'h-full rounded-none overflow-auto' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mock Interview in Progress</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </CardDescription>
          </div>
          {!startInFullScreen && (
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? <X className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Question and Transcription */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">Question:</h3>
                <p className="text-lg">{questionText}</p>
              </div>

              {/* Real-time transcription or saved answer */}
              {isRecording ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    <h3 className="font-medium">Recording in progress:</h3>
                  </div>
                  <p className="italic text-gray-600">{interimResult || transcript || "Listening..."}</p>
                </div>
              ) : transcript && !isProcessing && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">Your answer:</h3>
                  <p className="italic text-gray-600">{transcript}</p>
                </div>
              )}
            </div>

            {/* Right Column - Camera and Controls */}
            <div className="flex flex-col items-center justify-start space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {webcamEnabled && (
                <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-300 bg-black">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={true}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="w-full flex flex-col items-center justify-center">
                {isRequestingPermission ? (
                  <div className="flex flex-col items-center p-4">
                    <Loader className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-sm text-gray-500 font-medium text-center">Waiting for microphone permission...</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">Please allow access when prompted by your browser</p>
                  </div>
                ) : isProcessing ? (
                  <div className="flex flex-col items-center p-4">
                    <Loader className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-sm text-gray-500 text-center">Processing your answer...</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleRecordToggle}
                    variant={isRecording ? "destructive" : "default"}
                    className="w-full max-w-[200px]"
                    disabled={isRequestingPermission}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    {isRecording ? "Stop Recording" : permissionGranted ? "Record Answer" : "Request Microphone Access"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI Feedback - Kept in the same position */}
          {feedback && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-medium">AI Feedback:</h3>
              <p className="whitespace-pre-line">{feedback}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant={startInFullScreen ? "destructive" : "outline"} 
              onClick={() => {
                if (startInFullScreen) {
                  // Create a custom toast confirmation instead of window.confirm
                  toast((t) => (
                    <div className="flex flex-col gap-4 p-2">
                      <p className="font-medium">Are you sure you want to end the interview?</p>
                      <p className="text-sm text-gray-500">Your answers will be evaluated and scored.</p>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toast.dismiss(t.id)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={async () => {
                            toast.dismiss(t.id);
                            await onEndInterview();
                          }}
                        >
                          End Interview
                        </Button>
                      </div>
                    </div>
                  ), {
                    duration: 10000, // 10 seconds
                    position: 'top-center',
                    style: {
                      maxWidth: '500px',
                      padding: '16px',
                    },
                  });
                } else {
                  onEndInterview();
                }
              }}
            >
              End Interview
            </Button>
            <Button
               variant="outline"
               onClick={handlePreviousQuestion}
               disabled={currentQuestionIndex === 0 || isProcessing}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
          </div>
          <Button
             onClick={() => onNextQuestion('next')}
             disabled={isProcessing}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}