# Mock Interview AI

An AI-powered mock interview application that helps users practice for job interviews.

## Features

- AI-generated interview questions based on job role
- Real-time feedback on interview responses
- Interview history and performance tracking
- Resume analysis for personalized questions
- Video and audio recording for practice sessions

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google Gemini AI
- AssemblyAI
- OpenAI

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- API keys for Google Gemini, AssemblyAI, and OpenAI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mock-interview.git
cd mock-interview
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables
   - Create `.env` files in both frontend and backend directories
   - Add the required API keys and configuration

4. Start the development servers
```bash
# In one terminal
npm run dev:backend

# In another terminal
npm run dev:frontend
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

This application is configured for deployment on Render. See the [Render Deployment Guide](render-deployment-guide.md) for detailed instructions.

## License

This project is licensed under the ISC License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [AssemblyAI](https://www.assemblyai.com/)
- [OpenAI](https://openai.com/)
- [Render](https://render.com/) 