import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/database.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jobResumeRouter from './routes/JobResumeSchema.js';
import userRouter from './routes/user.js';
import interviewRouter from './routes/Interview.js';


const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS with specific options
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, 'https://mock-interview-frontend.onrender.com'] 
  : ['http://localhost:5173'];

app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

// Routes
app.use('/api/v1/user', userRouter);
// app.use('/api/v1/jobresume', jobResumeRouter);
app.use('/api/v1/interview', interviewRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
