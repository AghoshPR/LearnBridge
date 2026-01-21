import React, { useState,useEffect } from 'react';
import { Crown, Shield, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import Api from "../Services/Api"
import { useDispatch,useSelector } from 'react-redux';
import { loginStart,loginSuccess,loginFailure } from '../../Store/authSlice';
import { toast } from "sonner";


const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);

    const { isAuthenticated, role } = useSelector(state => state.auth);

    useEffect(() => {
    if (isAuthenticated && role === "admin") {
        navigate("/admin/dashboard", { replace: true });
    }
    }, [isAuthenticated, role, navigate]);

    
    

    const handleLogin = async (e) => {
        e.preventDefault();


        if (!email.trim()) {
            toast.error("Admin email is required");
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required");
            return;
        }

        setLoading(true); 
        dispatch(loginStart())

        

        

        try{
            const res = await Api.post("/auth/admin/login/",{
                email,
                password,
            })

            dispatch(loginSuccess({
            role:"admin",
            username:"Admin"
            }))

             toast.success("Welcome Admin");

            if(res.data.role==='admin'){
                navigate("/admin/dashboard", { replace: true })

            }

        }
        
        catch (err) {
            const message =
            err.response?.data?.error || "Invalid admin credentials";

            dispatch(loginFailure(message));
            toast.error(message);
        }finally{
            setLoading(false)
        }
        

    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">

            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900/40 to-black pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

            {/* Background Decorative Effects - Intensified */}
            {/* Gold Glow Top Left */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            {/* Blue Glow Bottom Right */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            {/* Center Subtle Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">

                {/* Header Branding */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/10 mb-2">
                        <Crown className="w-10 h-10 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Admin Access</h1>
                        <p className="text-amber-500/80 text-sm font-medium tracking-wide uppercase mt-2">Authorized Personnel Only</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="relative w-full max-w-md bg-[#16181D]/80 backdrop-blur-xl border border-amber-500/10 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 mx-auto">

                    {/* Security Icons Row */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Key className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1 font-medium uppercase tracking-wider">Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@learnbridge.com"
                                className="w-full bg-[#1a1b20] border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1 font-medium uppercase tracking-wider">Secure Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#1a1b20] border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium pr-12"
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

                        {/* Action Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-amber-500/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-4"
                        >
                            Access Control Panel
                        </button>

                        {/* Footer Info */}
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                                Security Level: Maximum | Encrypted Connection
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-xs">
                        © 2024 LearnBridge Admin Portal. All rights reserved.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;
