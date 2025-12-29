import React, { useState } from 'react';
import Api from '../Services/Api';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    FileText,
    CheckCircle,
    GraduationCap,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

const TeacherRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate=useNavigate()
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (formData.password !== formData.confirmPassword){
            alert("password do not match")
            return
        }

        try{

             const res = await Api.post("/auth/teacher/register/",{
            username:formData.email,
            email:formData.email,
            password:formData.password
            })

            sessionStorage.setItem("otp_email",res.data.email)
            sessionStorage.setItem("otp_role","teacher")
            navigate("/otp-verify")
        }
        catch(error){

            console.log("Teacher register error",error.response?.data);

            alert(error.response?.data?.email?.[0] ||  error.response?.data?.message ||
            "Teacher registration failed")
        }


    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Community & Steps */}
                <div className="space-y-12">

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Join Our<br />
                            Teaching Community
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Start your journey as an educator on LearnBridge.<br />
                            Empower students and share your knowledge.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="hidden md:block space-y-6">
                        <StepCard
                            icon={FileText}
                            step="Step 1: Register"
                            desc="Fill in your details and credentials"
                            color="bg-blue-100 text-blue-600"
                        />
                        <StepCard
                            icon={CheckCircle}
                            step="Step 2: Verify"
                            desc="Confirm your email and get approved"
                            color="bg-indigo-100 text-indigo-600"
                        />
                        <StepCard
                            icon={GraduationCap}
                            step="Step 3: Start Teaching"
                            desc="Create courses and inspire minds"
                            color="bg-purple-100 text-purple-600"
                        />
                    </div>

                </div>

                {/* Right Side: Register Form */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-md w-full mx-auto lg:ml-auto border border-gray-100">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4 text-emerald-600">
                            <CheckCircle size={28} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Teacher Signup</h2>
                        <p className="text-gray-500 mt-2 text-sm">Create your educator account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <InputGroup
                            label="Full Name"
                            icon={User}
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Dr. Angela Yu"
                        />

                        <InputGroup
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@school.edu"
                        />

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Lock size={12} /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Lock size={12} /> Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all mt-4 cursor-pointer"
                        >
                            Create Teacher Account
                        </button>

                        <div className="text-center text-xs text-gray-400 px-4">
                            I agree to the <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
                        </div>

                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Already have an account? <a href="#" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Sign in here</a>
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

// Helper Components
const StepCard = ({ icon, step, desc, color }) => {
    const Icon = icon;
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={24} strokeWidth={2} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg">{step}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
            </div>
        </div>
    );
};

const InputGroup = ({ label, icon, type, name, value, onChange, placeholder }) => {
    const Icon = icon;
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <Icon size={12} /> {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-500"
                placeholder={placeholder}
            />
        </div>
    );
};

export default TeacherRegister;
