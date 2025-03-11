# API URL Configuration Fix Guide

## Problem Identified

Your frontend application is trying to access the API at `https://interview-ai-qcn7.vercel.app/api/v1/user/login`, but this URL is returning a 404 Not Found error. This indicates a mismatch between your frontend's API URL configuration and the actual deployed backend URL.

## Solution

The correct API URL should be `https://mock-interview-api.vercel.app` as configured in your `.env.production` file. Here's how to fix this issue:

### 1. Update Vercel Environment Variables

Log in to your Vercel dashboard and update the environment variables for your frontend project:

1. Go to your frontend project in the Vercel dashboard
2. Navigate to the "Settings" tab
3. Click on "Environment Variables"
4. Find the `VITE_API_URL` variable
5. Change its value to `https://mock-interview-api.vercel.app`
6. Click "Save"
7. Redeploy your frontend application

### 2. Verify Backend Deployment

Make sure your backend API is properly deployed and accessible:

1. Try accessing `https://mock-interview-api.vercel.app/api/v1/user/login` directly in your browser or with a tool like Postman
2. If this URL also returns a 404, you may need to check your backend deployment

### 3. Check CORS Configuration

Ensure your backend's CORS configuration allows requests from your frontend domain:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://mock-interview.vercel.app'] 
        : 'http://localhost:5173',
    credentials: true,
    // other CORS options...
}));
```

### 4. Clear Browser Cache

After making these changes, clear your browser cache to ensure it's not using outdated configuration:

1. Open your browser's developer tools (F12)
2. Right-click on the refresh button and select "Empty Cache and Hard Reload"

## Additional Notes

If you've deployed your frontend to a custom domain or a different Vercel project URL (like `https://interview-ai-qcn7.vercel.app`), make sure to add this domain to your backend's CORS configuration as well.

If you continue to experience issues after making these changes, check the network tab in your browser's developer tools to see the exact API URL being used and any error responses.