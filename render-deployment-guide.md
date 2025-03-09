# Render Deployment Guide for AI Mock Interview Application

## Overview

This guide will walk you through deploying your AI Mock Interview application on Render.com. We'll set up two services:

1. A Web Service for your Node.js backend
2. A Static Site for your React frontend

## Prerequisites

- A Render.com account (sign up at https://render.com if you don't have one)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Deploy the Backend Web Service

1. Log in to your Render dashboard
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Configure the service with the following settings:
   - **Name**: `ai-mock-interview-backend` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `backend` (if your repository contains both frontend and backend)

5. Under "Advanced" settings, add the following environment variables:
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://vbsannatangi:MMqx3AsbaTcDKNzz@cluster0.ifqoy.mongodb.net/Ai-Mock-Interview
   SECRET_KEY=kuchbhibhai
   GEMINI_API_KEY=AIzaSyDGNTLIXqKuH0Zd1SzhzB9PwundqpIGB4
   ```

6. Click "Create Web Service"

## Step 2: Update CORS Configuration in Backend

Before deploying, you need to modify your backend's CORS configuration to accept requests from your Render frontend domain.

1. In your `server.js` file, update the CORS configuration:

```javascript
// Configure CORS with specific options
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-frontend-app-name.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));
```

Replace `your-frontend-app-name` with the name you'll give to your frontend service.

## Step 3: Deploy the Frontend Static Site

1. In your Render dashboard, click on "New" and select "Static Site"
2. Connect your Git repository
3. Configure the service with the following settings:
   - **Name**: `ai-mock-interview-frontend` (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Vite's default build output directory)
   - **Root Directory**: `frontend` (if your repository contains both frontend and backend)

4. Click "Create Static Site"

## Step 4: Update API Endpoint in Frontend

You need to update your frontend code to use the deployed backend URL instead of localhost.

1. Create a `.env` file in your frontend directory with:

```
VITE_API_BASE_URL=https://your-backend-app-name.onrender.com/api/v1
```

Replace `your-backend-app-name` with the name you gave to your backend service.

2. Update your API configuration in `src/lib/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/interview';
```

3. Similarly, update all other API calls in your application to use environment variables instead of hardcoded localhost URLs.

## Step 5: Verify Deployment

1. Once both services are deployed, visit your frontend URL (https://your-frontend-app-name.onrender.com)
2. Test the application to ensure it's working correctly
3. Check the logs in your Render dashboard if you encounter any issues

## Additional Notes

- **Free Tier Limitations**: Render's free tier will spin down your web service after 15 minutes of inactivity, which may cause a delay when the service needs to spin up again.
- **Environment Variables**: Keep your environment variables secure. Consider using Render's environment variable management for sensitive information.
- **Database Connection**: Ensure your MongoDB Atlas cluster is configured to accept connections from any IP address, or specifically from Render's IP ranges.
- **Custom Domains**: If you have a custom domain, you can configure it in the Render dashboard under your service settings.

## Troubleshooting

- If you encounter CORS issues, double-check your CORS configuration in the backend.
- If the frontend can't connect to the backend, verify that you've updated all API endpoint URLs correctly.
- Check Render logs for both services to identify any deployment or runtime errors.