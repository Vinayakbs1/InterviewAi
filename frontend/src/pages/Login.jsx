import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("login");
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [newUser, setNewUser] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerChangeHandler = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://interviewai-backend-kkpk.onrender.com/api/v1/user/login",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          credentials: 'include'
        }
      );

      console.log("Login Response:", res.data);

      if (res.data.success) {
        localStorage.setItem(
          "userName",
          res.data.fullName || user.email.split("@")[0]
        );
        localStorage.setItem("token", res.data.token);
        
        // Set token in axios defaults for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error Details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerHandler = async () => {
    try {
      const res = await axios.post(
        "https://interviewai-backend-kkpk.onrender.com/api/v1/user/register",
        newUser,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Register Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        setActiveTab("login");
      }
    } catch (e) {
      console.log("Register Error:", e.response?.data || e);
      toast.error(e.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to InterviewAI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your AI-powered interview preparation platform
          </p>
        </div>

        <Tabs
          defaultValue="login"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login" onClick={() => handleTabChange("login")}>
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => handleTabChange("register")}
            >
              Register
            </TabsTrigger>
          </TabsList>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ x: activeTab === "login" ? -300 : 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: activeTab === "login" ? 300 : -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                {activeTab === "login" ? (
                  <TabsContent value="login" className="space-y-4" forceMount>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        value={user.email}
                        name="email"
                        onChange={changeHandler}
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        value={user.password}
                        name="password"
                        onChange={changeHandler}
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={loginHandler}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </TabsContent>
                ) : (
                  <TabsContent
                    value="register"
                    className="space-y-4"
                    forceMount
                  >
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        value={newUser.fullName}
                        name="fullName"
                        onChange={registerChangeHandler}
                        type="text"
                        placeholder="Full Name"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        value={newUser.email}
                        name="email"
                        onChange={registerChangeHandler}
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        value={newUser.password}
                        name="password"
                        onChange={registerChangeHandler}
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={registerHandler}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      Create Account
                    </Button>
                  </TabsContent>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
