
import React, { useState,useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Eye, EyeOff } from 'lucide-react';
import bgImage from '../../assets/otp-background.jpg';
import logo from '../../assets/learnbridge-logo.png';
import { useSelector,useDispatch } from 'react-redux';
import { loginStart,loginSuccess,loginFailure } from '../../Store/authSlice';
import Api from '../Services/Api';
import { useNavigate } from 'react-router-dom'

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated } = useSelector((state)=>state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
  if (isAuthenticated) {
    navigate("/", { replace: true });
  }
  }, [isAuthenticated, navigate]);


  const handleSignIn = async (e) => {
    e.preventDefault();
    
    dispatch(loginStart())

    try {
      const res = await Api.post("/auth/login/",{
        email,
        password,
        role:"student",
      })

      dispatch(
        loginSuccess({
          role:res.data.role,
          username:res.data.username,
        })
      )

      navigate("/",{replace:true})


    } 
    
    catch (err){
      dispatch(loginFailure("Invalid Credentials"))
    }

    



  };

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
                Don't have an account? <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline">Sign up</a>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-slate-700/50 flex-1"></div>
                <span className="text-xs text-gray-500 font-medium">OR</span>
                <div className="h-px bg-slate-700/50 flex-1"></div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                className="w-full py-3 bg-white/5 border border-slate-600/50 hover:bg-white/10 rounded-xl text-white font-medium text-base shadow-lg transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="group-hover:text-white/90 transition-colors">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;