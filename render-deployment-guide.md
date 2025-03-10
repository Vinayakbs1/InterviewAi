# Detailed Render Deployment Guide for Mock Interview Application

This guide provides comprehensive instructions for deploying your Mock Interview application to Render using the provided `render.yaml` Blueprint configuration.

## Prerequisites

Before starting the deployment process, ensure you have:

1. A GitHub account with your project repository pushed and up-to-date
2. Your Gemini API key (from Google AI Studio)
3. A secure SECRET_KEY for JWT authentication
4. Node.js and npm installed locally (for testing before deployment)

## Step 1: Create a Render Account

1. Go to [Render's website](https://render.com/) and sign up for an account
2. Verify your email address
3. Complete the account setup process
4. (Optional) Set up a team if you're working with multiple developers

## Step 2: Connect Your GitHub Repository

1. Log in to your Render dashboard
2. Navigate to the "Blueprints" section in the dashboard
3. Click "New Blueprint Instance"
4. Select "Connect GitHub account" if you haven't connected your GitHub account yet
5. Grant Render permission to access your repositories
6. Select the repository containing your Mock Interview application

## Step 3: Deploy Using Blueprint

1. After selecting your repository, Render will automatically detect the `render.yaml` file
2. Review the services that will be created based on your configuration:
   - Backend API service (Node.js)
   - Frontend service (Node.js/Vite)
   - MongoDB database
3. Click "Apply Blueprint"
4. Render will begin provisioning your services according to the configuration

## Step 4: Configure Environment Variables

Your `render.yaml` file already defines most environment variables, but you need to manually set sensitive values:

1. Once services are created, navigate to the "mock-interview-api" service in your dashboard
2. Go to the "Environment" tab
3. Find the `SECRET_KEY` variable and click "Edit"
4. Enter a secure random string (at least 32 characters) for your JWT authentication
5. Find the `GEMINI_API_KEY` variable and click "Edit"
6. Enter your Google Gemini API key
7. Click "Save Changes"

## Step 5: Monitor the Deployment Process

1. Navigate to the "Events" tab for each service to monitor the build and deployment process
2. Check for any errors in the build logs
3. The initial build may take several minutes to complete

## Step 6: Verify Your Deployment

Once deployment is complete, verify that your application is working correctly:

1. Access your frontend at: `https://mock-interview-frontend.onrender.com`
2. Test your backend API at: `https://mock-interview-api.onrender.com`
3. Test key functionality like user registration, login, and interview sessions

## Step 7: Database Management

Render automatically provisions and manages your MongoDB database:

1. Navigate to the "Databases" section in your Render dashboard
2. Select the "mock-interview-db" database
3. Here you can:
   - View connection information
   - Monitor database metrics
   - Set up database backups (recommended for production)
   - Scale your database plan as needed

## Step 8: Set Up Continuous Deployment

Render automatically deploys changes when you push to your GitHub repository:

1. Make sure your `main` branch is set as the deployment branch
2. Each push to this branch will trigger a new build and deployment
3. You can view deployment history in the "Deploys" tab of each service

## Step 9: Performance Monitoring and Scaling

1. Navigate to the "Metrics" tab for each service to monitor:
   - CPU and memory usage
   - Request volume and response times
   - Error rates
2. If needed, you can scale your services:
   - Go to the "Settings" tab
   - Under "Instance Type", select a larger plan
   - Click "Save Changes"

## Step 10: Custom Domains (Optional)

For a production deployment, you may want to use custom domains:

1. Navigate to the "Settings" tab for each service
2. Under "Custom Domains", click "Add Custom Domain"
3. Follow the instructions to configure DNS settings
4. Render will automatically provision SSL certificates

## Troubleshooting Common Issues

### Build Failures

- Check build logs for specific error messages
- Verify that your `buildCommand` in `render.yaml` is correct
- Ensure all dependencies are properly listed in your package.json files

### Connection Issues Between Services

- Verify that the `VITE_API_URL` environment variable is correctly set
- Check that your frontend is making requests to the correct API URL
- Ensure CORS is properly configured in your backend

### Database Connection Issues

- Verify that the `MONGO_URI` environment variable is correctly set
- Check database logs for connection errors
- Ensure your IP is not being blocked by any firewall rules

### Performance Issues

- Consider upgrading your service plans for more resources
- Optimize your application code and database queries
- Implement caching where appropriate

## Cost Management

Render's free tier has limitations:

1. Free web services spin down after 15 minutes of inactivity
2. Free databases have storage and connection limits
3. For production use, consider upgrading to paid plans

## Maintenance Best Practices

1. Regularly update your dependencies to patch security vulnerabilities
2. Set up database backups for your production data
3. Monitor your application logs for errors and performance issues
4. Consider setting up alerts for critical errors or performance thresholds

## Conclusion

Your Mock Interview application should now be successfully deployed to Render. The frontend is accessible at `https://mock-interview-frontend.onrender.com` and the backend API at `https://mock-interview-api.onrender.com`. The MongoDB database is automatically provisioned and connected to your backend service.

For any issues or questions about Render deployment, refer to [Render's documentation](https://render.com/docs) or contact their support team.