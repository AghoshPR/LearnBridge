import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, Mail, Key, ArrowLeft } from 'lucide-react';
import bgImage from '../../assets/otp-background.jpg';
import logo from '../../assets/learnbridge-logo.png';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const navigate=useNavigate()

    const handleReset = async(e) => {
        e.preventDefault();

        try{
            await Api.post("/auth/student/forgot-password/",{email})

            sessionStorage.setItem("otp_email",email)
            sessionStorage.setItem("otp_flow","reset")

            navigate("/otp-verify")
        }catch(err){
            alert(err.response?.data?.error)
        }
        
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative px-4 md:px-8 lg:px-16"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-slate-900/50"></div>

            <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Side - Marketing Content */}
                <div className="hidden lg:flex flex-col text-white space-y-10 pr-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="info-badge bg-blue-500/20 p-2 rounded-lg border border-blue-400/30">
                                <Key className="w-6 h-6 text-blue-300" />
                            </div>
                            <span className="text-blue-300 font-medium tracking-wide">Learner Support</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
                            Reset Your Password
                        </h1>
                        <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                            Don't worry, it happens to the best of us. We'll help you get back to learning in no time.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Feature 1 */}
                        <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex items-center space-x-5 hover:bg-slate-800/50 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Shield className="w-6 h-6 text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Secure Process</h3>
                                <p className="text-sm text-gray-400">Your data is protected with encryption</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex items-center space-x-5 hover:bg-slate-800/50 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                <Clock className="w-6 h-6 text-pink-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Quick Recovery</h3>
                                <p className="text-sm text-gray-400">Get your reset link within seconds</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex items-center space-x-5 hover:bg-slate-800/50 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                                <CheckCircle className="w-6 h-6 text-teal-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Easy Steps</h3>
                                <p className="text-sm text-gray-400">Simple password reset process</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Forgot Password Form */}
                <div className="w-full max-w-md mx-auto">

                    {/* Brand Logo - Centered above form as requested */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="flex items-center gap-3 text-white">
                            <img
                                src={logo}
                                alt="LearnBridge Logo"
                                className="w-12 h-12 md:w-16 md:h-16 brightness-0 invert"
                            />
                            <span className="text-3xl md:text-5xl font-bold tracking-tight">LearnBridge</span>
                        </div>
                    </div>

                    {/* Glass Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group">

                        {/* Decorative background glow inside card */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                    <Key className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                                <p className="text-gray-400 text-sm">No worries, we'll send you reset instructions.</p>
                            </div>

                            <form onSubmit={handleReset} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-300 ml-1 font-medium">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                >
                                    Send Reset Link
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <button onClick={()=>navigate("/student/login")} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group/link cursor-pointer">
                                    <ArrowLeft size={16} className="group-hover/link:-translate-x-1 transition-transform" />
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
