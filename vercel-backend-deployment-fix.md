# Fixing Build Command for Backend Deployment on Vercel

## The Issue

When deploying the backend of your Mock Interview application to Vercel, you may encounter issues with the build command. This is because the default build command in your `vercel.json` is configured for the frontend deployment (`cd frontend && npm install && npm run build`), but when deploying the backend separately with the root directory set to `./backend`, this command is incorrect.

## Solution

When deploying the backend as a separate project on Vercel, follow these steps to fix the build command:

1. In the Vercel project settings for your backend deployment:
   - Set the **Root Directory** to `./backend`
   - Set the **Build Command** to `npm install && npm run build`
   - Set the **Output Directory** to `./`
   - Set the **Install Command** to `npm install`

## Why This Works

By setting the root directory to `./backend`, Vercel will execute all commands from within that directory. Therefore:

- You don't need to use `cd frontend` in your build command
- The build command should only include the commands needed to build the backend
- Based on your `package.json`, the backend has a simple build script that outputs "Build completed"

## Important Notes

1. The backend and frontend should be deployed as separate projects in Vercel
2. Each project should have its own environment variables configured
3. Make sure to update the CORS settings in your backend to allow requests from your frontend domain
4. Update the API URL in your frontend environment variables to point to your deployed backend

## Verifying the Deployment

After fixing the build command and deploying:

1. Check the deployment logs to ensure the build completed successfully
2. Test the API endpoints using a tool like Postman
3. Ensure your frontend can connect to the backend API

If you continue to experience issues, check the Vercel deployment logs for specific error messages.
