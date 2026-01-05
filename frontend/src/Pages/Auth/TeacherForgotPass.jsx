import React, { useState } from 'react';
import {
    ShieldCheck,
    Clock,
    GraduationCap,
    KeyRound,
    Mail,
    ArrowLeft,
    Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';

const TeacherForgotPass = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try{

            await Api.post("/auth/student/forgot-password/",{email})

            sessionStorage.setItem("otp_email",email)
            sessionStorage.setItem("otp_flow","reset")
            sessionStorage.setItem("otp_role","teacher")

            navigate("/otp-verify")

        }catch(err){
            alert(err?.response?.data?.error || "Failed to send OTP" )
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Info */}
                <div className="space-y-10">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-8 h-8 text-emerald-600" />
                            <span className="text-2xl font-bold tracking-tight text-gray-900">LearnBridge</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Reset Your Password
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md">
                            Secure your teaching account with a new password.<br />
                            We'll help you get back to educating in no time.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="hidden md:block space-y-4">
                        <FeatureRow
                            icon={ShieldCheck}
                            title="Secure Reset Process"
                            desc="256-bit encrypted password recovery"
                            color="bg-blue-100 text-blue-600"
                        />
                        <FeatureRow
                            icon={Clock}
                            title="Quick Recovery"
                            desc="Reset link delivered within seconds"
                            color="bg-amber-100 text-amber-600"
                        />
                        <FeatureRow
                            icon={GraduationCap}
                            title="Teacher Priority"
                            desc="Dedicated support for educators"
                            color="bg-emerald-100 text-emerald-600"
                        />
                    </div>

                </div>

                {/* Right Side: Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 max-w-md w-full mx-auto lg:ml-auto border border-gray-100">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 text-emerald-600">
                            <KeyRound size={32} strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                        <p className="text-gray-500 mt-2 text-sm">Enter your email to reset your password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-400"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Send size={18} />
                            Send Reset Link
                        </button>

                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <button onClick={()=>navigate("/teacher/login")} className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors group cursor-pointer">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Teacher Login
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

// Helper Component for Feature Row
const FeatureRow = ({ icon, title, desc, color }) => {
    const Icon = icon;
    return (
        <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-gray-900 font-semibold text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
            </div>
        </div>
    );
};

export default TeacherForgotPass;
