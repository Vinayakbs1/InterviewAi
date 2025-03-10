# Detailed Vercel Deployment Guide for Mock Interview Application

This guide provides comprehensive instructions for deploying your Mock Interview application to Vercel using the provided configuration files.

## Prerequisites

Before starting the deployment process, ensure you have:

1. A GitHub account with your project repository pushed and up-to-date
2. Your Gemini API key (from Google AI Studio)
3. A secure SECRET_KEY for JWT authentication
4. A MongoDB Atlas account (for database hosting)
5. Node.js and npm installed locally (for testing before deployment)
6. A Vercel account

## Step 1: Prepare Your Repository

Ensure your repository is properly structured with the following key files:

1. `vercel.json` at the root (already created)
2. `.env.production` in the frontend directory (already updated)
3. `.env.production` in the backend directory (already created)

## Step 2: Deploy the Frontend to Vercel

1. Log in to your [Vercel account](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: (leave as default, it's defined in vercel.json)
   - Output Directory: (leave as default, it's defined in vercel.json)
5. Under "Environment Variables", add:
   - `VITE_API_URL`: The URL of your backend API (will be created in the next step)
   - Add any other API keys needed (GEMINI_API_KEY, etc.)
6. Click "Deploy"

## Step 3: Deploy the Backend API to Vercel

1. Create a new project in Vercel
2. Import the same GitHub repository
3. Configure the project:
   - Framework Preset: Node.js
   - Root Directory: ./backend
   - Build Command: npm install && npm run build
   - Output Directory: ./
   - Install Command: npm install
4. Under "Environment Variables", add:
   - `NODE_ENV`: production
   - `PORT`: 3000
   - `MONGO_URI`: Your MongoDB connection string
   - `SECRET_KEY`: Your JWT secret key
   - `GEMINI_API_KEY`: Your Gemini API key
   - `FRONTEND_URL`: URL of your frontend (from Step 2)
5. Click "Deploy"

## Step 4: Set Up MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use an existing one)
3. Set up database access:
   - Create a database user with read/write permissions
   - Add your IP to the IP Access List (or allow access from anywhere for Vercel)
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
5. Add this connection string as the `MONGO_URI` environment variable in your Vercel backend project

## Step 5: Update API References

1. After deploying both frontend and backend, get the URL of your backend API from Vercel
2. Update the following:
   - In Vercel dashboard, go to your frontend project
   - Update the `VITE_API_URL` environment variable with your backend URL
   - Redeploy the frontend if necessary

## Step 6: Configure CORS in Backend

Update your backend CORS configuration to allow requests from your Vercel frontend domain:

1. In your `server.js` file, update the CORS configuration to include your Vercel frontend URL
2. Redeploy your backend API

## Step 7: Verify Your Deployment

1. Access your frontend application at the Vercel URL
2. Test user registration and login functionality
3. Test the interview process
4. Check that all API calls are working correctly

## Step 8: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository:

1. Any push to your main branch will trigger a new deployment
2. You can configure preview deployments for pull requests
3. You can set up custom domains for your production environment

## Step 9: Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the instructions to configure DNS settings
4. Update your environment variables if necessary to reflect the new domain

## Step 10: Monitoring and Logs

1. Use Vercel's built-in analytics to monitor your application
2. Check deployment logs for any errors
3. Set up error monitoring with a service like Sentry (optional)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend CORS configuration includes your frontend domain
2. **Environment Variables**: Check that all environment variables are correctly set in Vercel
3. **MongoDB Connection**: Verify your MongoDB connection string and network access settings
4. **API Endpoints**: Ensure all API endpoints are correctly formatted with the new domain

### Getting Help

- Vercel Documentation: [https://vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Documentation: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- Vite Documentation: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)