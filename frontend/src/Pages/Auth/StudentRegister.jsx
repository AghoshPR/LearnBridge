import React, { useState } from 'react';
import { BookOpen, Users, TrendingUp, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import bgImage from '../../assets/otp-background.jpg';
import logo from '../../assets/learnbridge-logo.png';
import Api from "../Services/Api"
import { useNavigate } from 'react-router-dom'

const StudentRegister = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate()

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if(password !== confirmPassword){
      alert("Password do not match")
      return
    }

    try{

      const res= await Api.post("/auth/student/register/",{
          username : fullName,
          email,
          password,

      })

      sessionStorage.setItem("otp_email",res.data.email)
      sessionStorage.setItem("otp_role","student")

      navigate("/otp-verify")

    } catch(err){
      alert("Registration failed")
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

        {/* Right Side - Register Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Brand Logo - Centered and Bigger */}
          <div className="flex flex-col items-center justify-center mb-6">
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
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-gray-400 text-sm">Join thousands of learners</p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Create Account Button - Pink Gradient */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-pink-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2 cursor-pointer"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account? <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;