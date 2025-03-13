import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import InterviewHistory from './pages/InterviewHistory'
import { Toaster } from 'react-hot-toast'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/interview-history',
    element: <InterviewHistory />
  },
  {
    path: '*',
    element: <LandingPage />
  }
])

function App() {
  return (
    <div className="min-h-screen bg-background">
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" />
    </div>
  )
}

export default App
