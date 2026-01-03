import React from 'react';
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
    Mail,
    Phone,
    GraduationCap,
    Clock,
    Edit
} from 'lucide-react';

const TeacherProfile = () => {
    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: false },
        { icon: User, label: 'My Profile', active: true },
        { icon: BookOpen, label: 'My Courses', active: false },
        { icon: Video, label: 'Live Classes', active: false },
        { icon: MessageSquare, label: 'Q&A', active: false },
        { icon: Users, label: 'Students', active: false },
        { icon: BarChart2, label: 'Analytics', active: false },
        { icon: Wallet, label: 'Wallet', active: false },
    ];

    const profileData = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@learnbridge.com',
        phone: '+91 98765 43210',
        qualification: 'Ph.D. in Computer Science',
        subjects: 'Web Development, Data Structures, Algorithms',
        experience: '8 years',
        bio: 'Passionate educator with expertise in modern web technologies and computer science fundamentals. I love teaching complex concepts in simple ways.'
    };

    const stats = [
        { label: 'Total Courses', value: '12', color: 'text-purple-400' },
        { label: 'Total Students', value: '1,234', color: 'text-blue-400' },
        { label: 'Average Rating', value: '4.8', color: 'text-yellow-400' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar - Duplicated for now to maintain standalone page as requested. 
           Ideally this should be a layout component. */}
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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.active
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-slate-400">Manage your profile information</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-900/20 transition-all">
                        <Edit size={18} />
                        Edit Profile
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left Column - Avatar */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl ring-4 ring-slate-800">
                                <span className="text-4xl font-bold text-white">DSJ</span>
                            </div>
                            <p className="text-slate-500 text-sm font-mono">Teacher ID: TCH-2024-001</p>
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

                {/* Bottom Stats Mock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default TeacherProfile;
