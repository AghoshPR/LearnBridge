import React, { useState } from 'react';
import {
    BookOpen,
    Users,
    PenTool,
    GraduationCap,
    Eye,
    EyeOff,
    Briefcase
} from 'lucide-react';

const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Teacher login:', { email });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left Side: Welcome & Features */}
                <div className="space-y-12 pr-0 lg:pr-12">

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Welcome Back,<br />
                            <span className="text-emerald-600">Educator!</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg">
                            Continue shaping the future, one lesson at a time
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureCard
                            icon={BookOpen}
                            title="Your Courses"
                            desc="Manage lessons & materials"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Students"
                            desc="Track progress & grades"
                        />
                        <FeatureCard
                            icon={PenTool}
                            title="Assignments"
                            desc="Create & review work"
                        />
                        <FeatureCard
                            icon={GraduationCap}
                            title="Analytics"
                            desc="View class insights"
                        />
                    </div>

                </div>

                {/* Right Side: Login Form */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 max-w-md w-full mx-auto lg:ml-auto border border-gray-100">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4 text-emerald-600">
                            <Briefcase size={28} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Teacher Login</h2>
                        <p className="text-gray-500 mt-2 text-sm">Access your teaching dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-500"
                                placeholder="name@school.edu"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-500 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30 cursor-pointer" />
                                <span className="text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Sign in to Dashboard
                        </button>

                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            New teacher? <a href="#" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Create an account</a>
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

// Helper Component for Feature Grid
const FeatureCard = ({ icon, title, desc }) => {
    const Icon = icon;
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    );
};

export default TeacherLogin;
