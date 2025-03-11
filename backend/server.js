
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

// Configure CORS for localhost only
app.use(cors({
    origin: 'https://interviewai-rvh6.onrender.com',
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
