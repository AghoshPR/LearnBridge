import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import {
    LayoutDashboard,
    User,
    BookOpen,
    Video,
    MessageSquare,
    Users,
    BarChart2,
    Wallet,
    LogOut,
    Edit,
    Camera,
    X,
    Upload,
    Mail,
    Phone,
    GraduationCap,
    Clock,
    Folder
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { logout } from '../../Store/authSlice';

const TeacherProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username } = useSelector((state) => state.auth);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mock Data
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        subjects: "",
        experience: "",
        bio: "",
        avatar: null,
        avatarPreview: null,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await Api.get("/teacher/profileview/")
                setProfileData(prev => ({
                    ...prev,
                    ...res.data,
                    experience: res.data.years_of_experience
                        ? `${res.data.years_of_experience}`
                        : "",

                    avatarPreview: res.data.profile_image || null,
                    avatar: null,
                }))

            } catch (err) {
                toast.error("Failed to load profile")
            }
        }
        fetchProfile()
    }, [])


    const handleSaveProfile = async () => {
        try {
            const payload = new FormData()

            payload.append("phone", profileData.phone);
            payload.append("qualification", profileData.qualification);
            payload.append("subjects", profileData.subjects);
            payload.append("bio", profileData.bio);

            if (profileData.experience) {
                payload.append(
                    "years_of_experience",
                    parseInt(profileData.experience)
                );
            }

            if (profileData.avatar instanceof File) {
                payload.append("profile_image", profileData.avatar);
            }

            await Api.patch("/teacher/profileview/", payload, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success("Profile updated successfully")
            setIsEditModalOpen(false)

        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                "Failed to update profile"
            );
        }
    }


    const stats = [
        { label: 'Total Courses', value: '12', color: 'text-purple-400' },
        { label: 'Total Students', value: '1,234', color: 'text-blue-400' },
        { label: 'Average Rating', value: '4.8', color: 'text-yellow-400' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileData(prev => ({
            ...prev,
            avatar: file,
            avatarPreview: URL.createObjectURL(file)
        }));
    };

    const handleLogout = async () => {
        try {
            await Api.post("/auth/logout/");
            toast.success("Logged out successfully 👋", {
                description: "See you again!",
                duration: 2500,
            });
        } catch (err) {
            toast.error("Logout failed", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            dispatch(logout());
            navigate("/teacher/login", { replace: true });
        }
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: false },
        { icon: User, label: 'My Profile', path: '/teacher/profile', active: true },
        { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
        { icon: Folder, label: 'Categories', path:'/teacher/coursecategory', active: false },
        { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
        { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
        { icon: Users, label: 'Students', path: '/teacher/students', active: false },
        { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
        { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Teacher Portal
                    </span>
                </div>

                <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => item.path && navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${item.active
                                ? 'bg-purple-600 shadow-lg shadow-purple-900/40 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={item.active ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-purple-600/50 to-blue-600/50 hover:from-purple-500 hover:to-blue-500 transition-all group shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 select-none">
                        <div className="bg-slate-900 p-3 rounded-[10px] flex items-center justify-between group-hover:bg-slate-800 transition-colors relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 text-lg">
                                    {username ? username.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">{username || 'Teacher'}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">Instructor</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-slate-400">Manage your profile information</p>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-900/20 transition-all"
                    >
                        <Edit size={18} />
                        Edit Profile
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left Column - Avatar */}
                        <div className="flex flex-col items-center space-y-4">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl ring-4 ring-slate-950 overflow-hidden">
                            {profileData.avatarPreview ? (
                            <img
                                src={profileData.avatarPreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <span className="text-4xl font-bold text-white">
                                {profileData.name
                                ? profileData.name.charAt(0).toUpperCase()
                                : "T"}
                            </span>
                            )}
                        </div>

                        <p className="text-slate-500 text-sm font-mono">
                            Teacher ID: TCH-2024-001
                        </p>
                        </div>


                        {/* Right Column - Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <User size={16} className="text-purple-500" />
                                    Full Name
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.name}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <Mail size={16} className="text-blue-500" />
                                    Email
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.email}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <Phone size={16} className="text-green-500" />
                                    Phone Number
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.phone}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <GraduationCap size={16} className="text-yellow-500" />
                                    Qualification
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.qualification}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <BookOpen size={16} className="text-pink-500" />
                                    Subjects
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.subjects}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <Clock size={16} className="text-orange-500" />
                                    Experience
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                                    {profileData.experience}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <User size={16} className="text-cyan-500" />
                                    Bio
                                </label>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                                    {profileData.bio}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

            </main>

            {/* Edit Profile Modal (Dark Theme) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit size={20} className="text-purple-500" />
                                Edit Profile
                            </h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-slate-900">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative group cursor-pointer">
                                    <div className="w-28 h-28 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-700 group-hover:border-purple-500 transition-colors">
                                        {profileData.avatar || profileData.avatarPreview ? (
                                            <img src={profileData.avatarPreview || profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera size={32} className="text-slate-500 group-hover:text-purple-500" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white shadow-lg">
                                        <Upload size={14} />
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Click to upload new photo</p>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-semibold">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-semibold">Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={profileData.qualification}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-slate-400 text-sm font-semibold">Subjects</label>
                                    <input
                                        type="text"
                                        name="subjects"
                                        value={profileData.subjects}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-slate-400 text-sm font-semibold">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={profileData.experience}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-slate-400 text-sm font-semibold">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold shadow-lg shadow-purple-900/20 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherProfile;
