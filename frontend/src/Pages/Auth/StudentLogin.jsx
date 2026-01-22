
import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Eye, EyeOff } from 'lucide-react';
import bgImage from '../../assets/otp-background.jpg';
import logo from '../../assets/learnbridge-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../Store/authSlice';
import Api from '../Services/Api';
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";



const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated,username } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const handleSignIn = async (e) => {
    e.preventDefault();


    if (!email.trim()) {
    toast.error("Email is required");
    return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    

    

    dispatch(loginStart())
    

    try {
      const res = await Api.post("/auth/login/", {
        email,
        password,
        role: "student",
      })

      dispatch(
        loginSuccess({
          role: res.data.role,
          username: res.data.username,
        })
      )
      toast.success(`Welcome back, ${res.data.username}`);
      navigate("/")


    }

    catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Invalid email or password";

      dispatch(loginFailure(message));
      toast.error(message);
    }





  };


  const hangleGoogle = async (credentialResponse) => {
            dispatch(loginStart());
            toast("Login with google")

            try {
              const res = await Api.post(
                "/auth/google-login/",
                {
                  token: credentialResponse.credential, 
                  role: "student",
                },
                { withCredentials: true }
              );

              dispatch(
                loginSuccess({
                  role: res.data.role,
                  username: res.data.username,
                })
              );

              navigate("/", { replace: true });
            } catch (err) {
              dispatch(loginFailure("Google login failed"));
            }
          }

   


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative px-4 md:px-8 lg:px-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/40"></div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Promotional Content */}
        <div className="hidden lg:flex flex-col text-white space-y-12 pr-12">

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
              Transform Your Future <br />
              with Premium Learning
            </h1>
            <p className="text-gray-200 text-lg max-w-lg">
              Join over 50,000 learners who are mastering new skills and advancing their careers with our world-class courses.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex items-start space-x-4 max-w-lg">
              <div className="p-3 bg-blue-600 rounded-lg shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">1,500+ Courses</h3>
                <p className="text-sm text-gray-300">Access expert-led courses in technology, business, design, and more</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex items-start space-x-4 max-w-lg">
              <div className="p-3 bg-fuchsia-600 rounded-lg shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Expert Instructors</h3>
                <p className="text-sm text-gray-300">Learn from industry professionals with real-world experience</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex items-start space-x-4 max-w-lg">
              <div className="p-3 bg-teal-500 rounded-lg shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Career Growth</h3>
                <p className="text-sm text-gray-300">95% of our learners report career advancement within 6 months</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Brand Logo - Centered and Bigger */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center gap-4 text-white">
              <img
                src={logo}
                alt="LearnBridge Logo"
                className="w-12 h-12 md:w-20 md:h-20 brightness-0 invert"
              />
              <span className="text-3xl md:text-5xl font-bold tracking-tight">LearnBridge</span>
            </div>
          </div>

          {/* Glass Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm">Sign in to continue learning</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={()=>navigate("/student/forgotpass")} type="button" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer hover:underline">
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2 cursor-pointer"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center space-y-6">
              <p className="text-sm text-gray-400">
                Don't have an account?
                <button onClick={() => navigate("/student/register")} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline cursor-pointer"> Sign up</button>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-slate-700/50 flex-1"></div>
                <span className="text-xs text-gray-500 font-medium">OR</span>
                <div className="h-px bg-slate-700/50 flex-1"></div>
              </div>

              {/* Google Sign In */}
              <GoogleLogin
              
              onSuccess={hangleGoogle}
              onError={() => {
                dispatch(loginFailure("Google login cancelled"));
              }}
          useOneTap={false}
          
          />

              

              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;