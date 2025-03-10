# Render Deployment Guide for Mock Interview Application

This guide provides step-by-step instructions for deploying the Mock Interview application on Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your code pushed to a GitHub repository
3. MongoDB Atlas account for database hosting

## Pre-Deployment Setup

1. Ensure your MongoDB Atlas cluster is properly configured:
   - Create a new cluster if you don't have one
   - Set up a database user with appropriate permissions
   - Configure network access to allow connections from anywhere (or specifically from Render's IPs)
   - Get your MongoDB connection string

2. Make sure all environment variables are properly set in both `.env` and `.env.production` files
   - Backend: `PORT`, `MONGO_URI`, `SECRET_KEY`, `GEMINI_API_KEY`
   - Frontend: `VITE_API_URL`, `VITE_GEMINI_API_KEY`, `VITE_ASSEMBLYAI_API_KEY`, `VITE_OPENAI_API_KEY`

3. Commit all changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push
   ```

## Deployment Steps

### Option 1: Using the Blueprint (render.yaml)

1. Log in to your Render account
2. Click on "Blueprints" in the dashboard
3. Click "New Blueprint Instance"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure your services
6. Review the configuration and click "Apply"
7. Set up the environment variables that are marked as `sync: false` in the render.yaml file:
   - MONGO_URI: Your MongoDB connection string
   - SECRET_KEY: Your JWT secret key
   - GEMINI_API_KEY: Your Google Gemini API key
   - VITE_GEMINI_API_KEY: Your Google Gemini API key (for frontend)
   - VITE_ASSEMBLYAI_API_KEY: Your AssemblyAI API key
   - VITE_OPENAI_API_KEY: Your OpenAI API key

### Option 2: Manual Deployment

#### Backend Deployment

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: mock-interview-backend
   - Environment: Node
   - Root Directory: (leave blank)
   - Build Command: `npm run install:backend`
   - Start Command: `npm run start:backend`
5. Add the following environment variables:
   - PORT: 3000
   - NODE_ENV: production
   - FRONTEND_URL: https://mock-interview-frontend.onrender.com
   - MONGO_URI: (your MongoDB connection string)
   - SECRET_KEY: (your secret key)
   - GEMINI_API_KEY: (your Gemini API key)
6. Click "Create Web Service"

#### Frontend Deployment

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: mock-interview-frontend
   - Environment: Node
   - Root Directory: (leave blank)
   - Build Command: `npm run install:frontend && npm run build:frontend`
   - Start Command: `npm run start:frontend`
5. Add the following environment variables:
   - PORT: 10000
   - VITE_API_URL: https://mock-interview-backend.onrender.com/api/v1/interview
   - VITE_GEMINI_API_KEY: (your Gemini API key)
   - VITE_ASSEMBLYAI_API_KEY: (your AssemblyAI API key)
   - VITE_OPENAI_API_KEY: (your OpenAI API key)
6. Click "Create Web Service"

## Post-Deployment

1. Wait for both services to deploy successfully
2. Test the application by navigating to your frontend URL (https://mock-interview-frontend.onrender.com)
3. Check the logs for any errors and troubleshoot as needed

## Troubleshooting

- If you encounter CORS issues:
  - Verify that the backend CORS configuration includes your frontend URL
  - Check the Network tab in browser DevTools for specific CORS errors
  - Ensure the `allowedOrigins` array in server.js includes your frontend domain

- If the frontend can't connect to the backend:
  - Check that the VITE_API_URL is set correctly in the frontend environment variables
  - Verify the backend is running by visiting the API endpoint directly
  - Check the backend logs for any errors

- For database connection issues:
  - Verify your MONGO_URI is correct
  - Ensure your MongoDB Atlas cluster allows connections from Render's IP addresses
  - Check if your database user has the correct permissions

## Maintenance

- Monitor your application's performance and logs in the Render dashboard
- Set up automatic deployments by connecting your GitHub repository to Render
- Consider setting up a custom domain for your application
- Regularly update your dependencies to keep the application secure

## Scaling (Future Considerations)

- Upgrade your Render plan as your application grows
- Consider using Render's autoscaling features for handling increased traffic
- Set up monitoring and alerts to be notified of any issues
