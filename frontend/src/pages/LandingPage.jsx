"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaMicrophone,
  FaVideo,
  FaFileUpload,
  FaBrain,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaUsers,
  FaBuilding,
  FaClock,
  FaChartLine,
  FaLightbulb,
  FaChevronDown,
} from "react-icons/fa"
import { motion } from "framer-motion"


const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 bg-white border rounded-lg shadow-md hover:shadow-xl transition-all"
  >
    <div className="mb-4 text-black">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)

const TestimonialCard = ({ quote, name, role, image }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white rounded-lg shadow-md relative overflow-hidden">
    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-gray-100 rounded-full opacity-20" />
    <FaStar className="text-yellow-400 text-xl mb-4" />
    <p className="text-gray-600 mb-4 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <img src={image || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
  </div>
  </motion.div>
)

const StatsCard = ({ icon, count, label }) => (
  <motion.div whileHover={{ y: -5 }} className="text-center p-6 bg-white rounded-lg shadow-md">
    <div className="flex justify-center mb-3">{icon}</div>
    <h3 className="text-3xl font-bold mb-1">{count}</h3>
    <p className="text-gray-600">{label}</p>
  </motion.div>
)

function LandingPage() {
  const navigate = useNavigate()
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isCtaVisible, setIsCtaVisible] = useState(false)

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
      },
    }),
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Video Modal Component
  const VideoModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={() => setIsVideoModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-4xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video bg-black relative">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="InterviewAI Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <button
            className="absolute top-4 right-4 bg-black/70 text-white h-10 w-10 rounded-full hover:bg-black/90"
            onClick={() => setIsVideoModalOpen(false)}
          >
            ✕
          </button>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white shadow-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaBrain className="text-black text-xl" />
            <span className="text-xl font-bold">InterviewAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
              href="#features"
              className="text-sm font-medium hover:text-gray-800 cursor-pointer"
            >
              Features
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
              href="#how-it-works"
              className="text-sm font-medium hover:text-gray-800 cursor-pointer"
            >
              How It Works
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("success-stories");
              }}
              href="#success-stories"
              className="text-sm font-medium hover:text-gray-800 cursor-pointer"
            >
              Success Stories
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
              }}
              href="#pricing"
              className="text-sm font-medium hover:text-gray-800 cursor-pointer"
            >
              Pricing
            </motion.a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button 
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 hidden md:block"
              onClick={() => navigate('/login')}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gray-100 rounded-full opacity-60" />
          <div className="absolute top-1/2 -left-24 w-40 h-40 bg-gray-100 rounded-full opacity-40" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Ace Your Next Interview with AI-Powered Practice
                </h1>
                <p className="text-lg text-gray-600">
                  Upload your resume, specify your target role, and get personalized interview questions with real-time
                  AI feedback on your responses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 flex items-center gap-2 shadow-lg"
                  >
                    Start Practicing Now
                    <FaArrowRight />
                  </motion.button>
                </div>
                
                <div className="pt-4 flex items-center gap-3">
                  <p className="text-sm text-gray-600">Join <span className="font-semibold">10,000+</span> job seekers today</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
              <div className="relative mx-auto aspect-video max-w-[600px] rounded-xl border bg-white shadow-xl overflow-hidden">
                <img
                    src="/placeholder.svg?height=400&width=600" 
                  alt="AI Interview Platform Demo"
                  className="object-cover w-full h-full"
                />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}></div>
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                
                {/* Floating card effects */}
                <motion.div 
                  className="absolute -bottom-10 -left-12 bg-white p-4 rounded-lg shadow-lg max-w-[200px] hidden md:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="font-semibold">Real-time Feedback</span>
                  </div>
                  <p className="text-xs text-gray-600">AI analyzes your answers and provides instant suggestions</p>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-10 -right-12 bg-white p-4 rounded-lg shadow-lg max-w-[200px] hidden md:block"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaBrain className="text-purple-500" />
                    <span className="font-semibold">Tailored Questions</span>
                  </div>
                  <p className="text-xs text-gray-600">Questions matched to your experience and target role</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>



        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard 
                icon={<FaUsers className="h-6 w-6 text-blue-500" />} 
                count="10,000+" 
                label="Active Users" 
              />
              <StatsCard 
                icon={<FaBuilding className="h-6 w-6 text-green-500" />} 
                count="500+" 
                label="Companies Hiring" 
              />
              <StatsCard 
                icon={<FaClock className="h-6 w-6 text-yellow-500" />} 
                count="120,000+" 
                label="Practice Hours" 
              />
              <StatsCard 
                icon={<FaChartLine className="h-6 w-6 text-red-500" />} 
                count="85%" 
                label="Success Rate" 
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
              <p className="mt-4 text-xl text-gray-600">Everything you need to prepare for your next interview</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<FaFileUpload className="h-10 w-10 text-blue-500" />}
                title="Resume Analysis"
                description="Upload your resume and our AI will analyze it to generate relevant interview questions tailored to your experience."
              />
              <FeatureCard
                icon={<FaBrain className="h-10 w-10 text-purple-500" />}
                title="AI-Generated Questions"
                description="Get industry-specific questions based on your job role, description, and resume to prepare you for the real interview."
              />
              <FeatureCard
                icon={<FaVideo className="h-10 w-10 text-red-500" />}
                title="Video Recording"
                description="Practice answering questions with our video recording feature to improve your presentation and communication skills."
              />
              <FeatureCard
                icon={<FaMicrophone className="h-10 w-10 text-yellow-500" />}
                title="Speech Analysis"
                description="Our AI analyzes your speech patterns, tone, and clarity to provide feedback on your verbal communication."
              />
              <FeatureCard
                icon={<FaCheckCircle className="h-10 w-10 text-green-500" />}
                title="Answer Evaluation"
                description="Get detailed feedback on your answers, with suggestions for improvement and alternative responses."
              />
              <FeatureCard
                icon={<FaChartLine className="h-10 w-10 text-orange-500" />}
                title="Progress Tracking"
                description="Track your improvement over time with detailed analytics and performance metrics for each practice session."
              />
            </div>
            
            {/* Feature showcase */}
            <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">AI-Powered Analysis</span>
                <h3 className="text-2xl font-bold">Resume-to-Interview Intelligence</h3>
                <p className="text-gray-600">Our proprietary AI technology scans your resume and job description to generate the most likely interview questions you'll face. The system learns from thousands of real interviews to provide authentic practice scenarios.</p>
                
                <ul className="space-y-3 mt-6">
                  {[
                    "Extracts key skills and experiences from your resume",
                    "Matches with target job requirements",
                    "Identifies potential knowledge gaps",
                    "Suggests improvements for your answers"
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="relative rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="AI Resume Analysis" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-white text-xl font-bold mb-2">Resume Analysis in Action</h4>
                  <p className="text-white/80 mb-4">Watch how our AI identifies key elements from your resume</p>
                </div>
              </motion.div>
            </div>
            
            {/* Second feature showcase (reversed) */}
            <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="relative rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1573497161161-5077b6dc7624?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Real-time Feedback" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-white text-xl font-bold mb-2">Real-time Feedback System</h4>
                  <p className="text-white/80 mb-4">Receive instant feedback on your interview performance</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-4 order-1 md:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Real-time Coaching</span>
                <h3 className="text-2xl font-bold">Instant Performance Feedback</h3>
                <p className="text-gray-600">During your mock interview, our AI analyzes your responses in real-time and provides immediate feedback on content, delivery, and body language to help you improve on the spot.</p>
                
                <ul className="space-y-3 mt-6">
                  {[
                    "Analyzes verbal clarity and filler words",
                    "Measures confidence level and enthusiasm",
                    "Identifies strong and weak answers",
                    "Provides actionable improvement tips"
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gray-200 rounded-full opacity-40" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gray-200 rounded-full opacity-30" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600">Get started with InterviewAI in three simple steps</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div 
                className="relative p-8 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">1</div>
                <div className="mb-6 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Upload Resume" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 mt-4">Upload Your Resume</h3>
                <p className="text-gray-600">Submit your resume and specify your target role to get started with personalized interview preparation.</p>
                <div className="mt-4 flex items-center text-black">
                  <FaLightbulb className="mr-2" />
                  <span className="text-sm font-medium">Supports PDF, DOCX, and TXT formats</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative p-8 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">2</div>
                <div className="mb-6 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Practice Interviews" 
                    className="w-full h-full object-cover"
                  />
              </div>
                <h3 className="text-xl font-semibold mb-3 mt-4">Practice Interviews</h3>
                <p className="text-gray-600">Engage in realistic interview simulations with AI-generated questions tailored to your experience.</p>
                <div className="mt-4 flex items-center text-black">
                  <FaLightbulb className="mr-2" />
                  <span className="text-sm font-medium">Customized for your industry and role</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative p-8 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">3</div>
                <div className="mb-6 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Get Feedback" 
                    className="w-full h-full object-cover"
                  />
              </div>
                <h3 className="text-xl font-semibold mb-3 mt-4">Get Feedback</h3>
                <p className="text-gray-600">Receive detailed feedback on your responses, including suggestions for improvement and performance metrics.</p>
                <div className="mt-4 flex items-center text-black">
                  <FaLightbulb className="mr-2" />
                  <span className="text-sm font-medium">Track progress over multiple sessions</span>
                </div>
              </motion.div>
            </div>
            
            {/* Interactive demo prompt */}
            <motion.div 
              className="mt-16 bg-white p-8 rounded-xl shadow-xl mx-auto max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <FaBrain className="h-8 w-8 text-purple-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Try a sample interview question:</h3>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="font-medium">Tell me about a time when you had to solve a complex problem under tight deadlines. What was your approach and what was the outcome?</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center gap-2">
                      <FaMicrophone />
                      Record Answer
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      See Sample
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-xl text-gray-600">Choose the plan that works for you</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div 
                className="border rounded-xl p-6 flex flex-col h-full"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Free</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">Get started with basic interview practice</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "5 practice interviews per month",
                    "Basic question generation",
                    "Text-based feedback",
                    "Limited resume analysis"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="mt-auto w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Sign Up Free
                </button>
              </motion.div>
              
              <motion.div 
                className="border rounded-xl p-6 bg-gray-50 relative flex flex-col h-full shadow-lg"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="absolute top-0 inset-x-0 flex justify-center">
                  <div className="px-4 py-1 bg-black text-white text-sm rounded-b-lg shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="mb-6 mt-6">
                  <h3 className="text-lg font-semibold mb-2">Pro</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$19</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">Full interview preparation toolkit</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "Unlimited practice interviews",
                    "Advanced question generation",
                    "Video and audio feedback",
                    "Full resume analysis",
                    "Performance tracking",
                    "Industry-specific questions"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="mt-auto w-full py-2 bg-black text-white rounded-md hover:bg-gray-800">
                  Get Started
                </button>
              </motion.div>
              
              <motion.div 
                className="border rounded-xl p-6 flex flex-col h-full"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Teams</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">For recruiters and team managers</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "Everything in Pro",
                    "Up to 5 team members",
                    "Team analytics dashboard",
                    "Custom question libraries",
                    "Branded interview environments",
                    "Priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="mt-auto w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Contact Sales
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Success Stories</h2>
              <p className="mt-4 text-xl text-gray-600">See how InterviewAI has helped candidates land their dream jobs</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="Thanks to InterviewAI, I felt fully prepared for my software engineering interview at Google. The AI-generated questions were spot-on and the feedback helped me refine my responses!"
                name="Sarah Chen"
                role="Software Engineer at Google"
                image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              
              <TestimonialCard
                quote="The feedback on my communication skills helped me improve significantly. After just two weeks of practice, I landed my dream job at Microsoft!"
                name="James Wilson"
                role="Product Manager at Microsoft"
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              
              <TestimonialCard
                quote="The practice sessions boosted my confidence tremendously. The detailed analytics showed my progress and I aced my interview at Amazon!"
                name="Emily Rodriguez"
                role="Data Scientist at Amazon"
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </div>
            
            {/* Featured success story */}
            <motion.div 
              className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">From Rejection to Offer Letter</h3>
                  <p className="text-gray-600 mb-6">
                    "After failing three interviews in a row, I was about to give up. Then I found InterviewAI and everything changed. The platform identified that I was struggling with behavioral questions and helped me craft compelling stories from my experience."
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Michael Chang" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  <div>
                      <h4 className="font-semibold">Michael Chang</h4>
                      <p className="text-sm text-gray-500">Senior Developer at Netflix</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="text-black hover:underline flex items-center gap-1">
                      <span>Read full success story</span>
                      <FaArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                  <div>
                  <img 
                    src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Success Story" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to ace your next interview?</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who have already improved their interview skills and landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 shadow-lg flex items-center justify-center gap-2">
                Start Practicing Now
                <FaArrowRight />
              </button>
              <button className="px-6 py-3 border border-white rounded-md hover:bg-white/10 flex items-center justify-center gap-2">
                <FaVideo />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">10k+</div>
                  <div className="text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">85%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">500+</div>
                  <div className="text-gray-400">Companies</div>
                  </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">4.9/5</div>
                  <div className="text-gray-400">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to know about InterviewAI</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does InterviewAI generate interview questions?",
                answer: "InterviewAI analyzes your resume and target job description using advanced AI algorithms to identify the most relevant skills and experiences. It then generates questions that are likely to be asked in a real interview for that specific role and industry."
              },
              {
                question: "Can InterviewAI help with technical interviews?",
                answer: "Yes! InterviewAI supports technical interviews for a variety of roles including software engineering, data science, and IT positions. Our AI can generate coding challenges, system design questions, and technical knowledge assessments tailored to your experience level."
              },
              {
                question: "How accurate is the feedback provided by InterviewAI?",
                answer: "InterviewAI's feedback is based on analysis of thousands of successful interviews and industry best practices. Our AI evaluates your responses on multiple dimensions including content relevance, structure, delivery, and communication skills with an accuracy rate of over 90% compared to human interviewers."
              },
              {
                question: "Can I use InterviewAI on my mobile device?",
                answer: "Yes, InterviewAI is fully responsive and works on all modern mobile devices and tablets. You can practice interviews on the go, whenever inspiration strikes."
              },
              {
                question: "Is my data secure with InterviewAI?",
                answer: "Absolutely. We take data privacy very seriously. All your information, including your resume and recorded interviews, is encrypted and stored securely. We never share your data with third parties without your explicit consent."
              }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                className="border rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <FaChevronDown className="transform transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="p-6 pt-0 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FaBrain className="text-black text-xl" />
                <span className="text-xl font-bold">InterviewAI</span>
              </div>
              <p className="text-gray-600">Empowering job seekers with AI-powered interview preparation.</p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.871-1.286-6.537-.183-9.938.258-.796.749-1.866 1.375-2.981.714-1.284 1.504-2.394 2.192-3.194 1.161-1.346 2.446-2.028 3.908-2.077.657-.018 1.354.112 2.066.39 1.323.671 2.362 1.879 3.297 3.597 1.218 2.871 2.287 6.537.184 9.938-.259.795-.748 1.866-1.375 2.98-.714 1.284-1.504 2.395-2.192 3.195-1.161 1.345-2.446 2.027-3.908 2.077-.149.003-.296.005-.443.005zm-2.13-19.088c-.79 1.429-1.274 2.903-1.411 3.968-.998 2.784-.94 5.914.15 8.253.6 1.285 1.334 2.061 2.186 2.3.636.18 1.365.129 2.077-.091.952-.293 1.869-.999 2.618-2.023.76-1.038 1.437-2.261 1.994-3.628.997-2.784.94-5.914-.151-8.253-.599-1.285-1.333-2.061-2.185-2.299-.455-.128-.933-.157-1.402-.073-.94.167-1.889.779-2.724 1.763-.252.297-.493.635-.736 1.013-.602.94-1.127 1.992-1.518 1.518-2.851.193-.569.437-1.136.729-1.684.437-.825.979-1.634 1.606-2.407l-1.233 1.31z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.199 24c-1.144 0-2.14-.215-2.99-.645-1.324-.669-2.364-1.878-3.092-3.596-1.217-2.871-1.286-6.537-.183-9.938.258-.796.749-1.866 1.375-2.981.714-1.284 1.504-2.394 2.192-3.194 1.161-1.346 2.446-2.028 3.908-2.077.657-.018 1.354.112 2.066.39 1.323.671 2.362 1.879 3.297 3.597 1.218 2.871 2.287 6.537.184 9.938-.259.795-.748 1.866-1.375 2.98-.714 1.284-1.504 2.395-2.192 3.195-1.161 1.345-2.446 2.027-3.908 2.077-.149.003-.296.005-.443.005zm-2.13-19.088c-.79 1.429-1.274 2.903-1.411 3.968-.998 2.784-.94 5.914.15 8.253.6 1.285 1.334 2.061 2.186 2.3.636.18 1.365.129 2.077-.091.952-.293 1.869-.999 2.618-2.023.76-1.038 1.437-2.261 1.994-3.628.997-2.784.94-5.914-.151-8.253-.599-1.285-1.333-2.061-2.185-2.299-.455-.128-.933-.157-1.402-.073-.94.167-1.889.779-2.724 1.763-.252.297-.493.635-.736 1.013-.602.94-1.127 1.992-1.518 1.518-2.851.193-.569.437-1.136.729-1.684.437-.825.979-1.634 1.606-2.407l-1.233 1.31z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-gray-800">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-gray-800">How It Works</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-gray-800">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">FAQ</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-800">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && <VideoModal />}
    </div>
  )
}

export default LandingPage

