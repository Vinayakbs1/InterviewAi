import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/database.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRouter from '../routes/user.js';
import interviewRouter from '../routes/Interview.js';

// Initialize express app
const app = express();
dotenv.config();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS with specific options
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'https://mock-interview.vercel.app', 
            'https://mock-interview-api.vercel.app', 
            'https://interview-ai-orcin.vercel.app', 
            'https://interview-ai-qcn7.vercel.app',
            'http://localhost:5173'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Temporarily allow all origins for debugging
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
    exposedHeaders: ['set-cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Add a middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} from origin: ${req.headers.origin}`);
    next();
});

// Handle preflight requests explicitly
app.options('*', cors());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/interview', interviewRouter);

// Root route for health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Export the Express API
export default app;