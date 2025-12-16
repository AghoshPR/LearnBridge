/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Folder,
    Users,
    GraduationCap,
    MessageSquare,
    Tag,
    Percent,
    Ticket,
    Wallet,
    Settings,
    LogOut,
    ShieldCheck,
    Menu,
    X
} from 'lucide-react';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#050505] flex font-sans text-gray-100">

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0B0F] border-b border-gray-800 flex items-center justify-between px-4 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-bold text-white text-base">LearnBridge</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-[#0A0B0F] border-r border-gray-800 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg leading-tight">LearnBridge</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={BookOpen} label="Courses" />
                    <NavItem icon={Folder} label="Categories" />
                    <NavItem icon={Users} label="Users" />
                    <NavItem icon={GraduationCap} label="Teachers" />
                    <NavItem icon={MessageSquare} label="Q&A Moderation" />
                    <NavItem icon={Tag} label="Tags Management" />
                    <NavItem icon={Percent} label="Offers" />
                    <NavItem icon={Ticket} label="Coupons" />
                    <NavItem icon={Wallet} label="Wallet" />
                    <NavItem icon={Settings} label="Settings" />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-800">
                    <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 select-none">
                        <div className="bg-[#0A0B0F] p-3 rounded-[10px] flex items-center justify-between group-hover:bg-[#13151b] transition-colors relative">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                    A
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">Admin</span>
                                    <span className="text-[10px] text-gray-400 mt-1 font-medium">Super User</span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all" title="Logout">
                                <LogOut size={18} />
                            </button>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 transition-all duration-300">

                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatsCard
                        title="Total Users"
                        value="12,458"
                        change="+12.5%"
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Active Courses"
                        value="342"
                        change="+8.2%"
                        icon={BookOpen}
                        color="green"
                    />
                    <StatsCard
                        title="Pending Teachers"
                        value="23"
                        change="+5"
                        icon={GraduationCap}
                        color="orange"
                    />
                    <StatsCard
                        title="Q&A Posts"
                        value="5,892"
                        change="+15.3%"
                        icon={MessageSquare}
                        color="purple"
                    />
                </div>

                {/* Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Activity */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full border border-gray-700">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                </div>
                                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ActivityItem
                                title="New teacher approval request"
                                desc="John Smith • 5 min ago"
                                color="blue"
                            />
                            <ActivityItem
                                title="Course published"
                                desc="Sarah Johnson • 12 min ago"
                                color="green"
                            />
                            <ActivityItem
                                title="Q&A post reported"
                                desc="Mike Chen • 23 min ago"
                                color="purple"
                            />
                            <ActivityItem
                                title="New user registered"
                                desc="Emma Wilson • 35 min ago"
                                color="blue"
                            />
                            <ActivityItem
                                title="Course updated"
                                desc="David Lee • 1 hour ago"
                                color="orange"
                            />
                        </div>
                    </div>

                    {/* Platform Growth */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full border border-gray-700">
                                    <TrendingUpIcon />
                                </div>
                                <h2 className="text-lg font-bold text-white">Platform Growth</h2>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <GrowthBar label="User Growth" percent={85} change="+24%" color="bg-green-500" />
                            <GrowthBar label="Course Completion" percent={65} change="+18%" color="bg-blue-500" />
                            <GrowthBar label="Engagement Rate" percent={78} change="+32%" color="bg-purple-500" />
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

// Helper Components

const NavItem = ({ icon: Icon, label, active = false }) => (
    <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
    `}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
    </div>
);

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
    const colors = {
        blue: 'text-blue-500 bg-blue-500/10',
        green: 'text-green-500 bg-green-500/10',
        orange: 'text-amber-500 bg-amber-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
    };

    const textColors = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        orange: 'text-amber-400',
        purple: 'text-purple-400',
    };

    return (
        <div className="bg-[#111216] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</span>
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <p className={`text-xs mt-2 font-medium ${textColors[color]}`}>
                {change} <span className="text-gray-500">from last month</span>
            </p>
        </div>
    );
};

const ActivityItem = ({ title, desc, color }) => {
    const dotColors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-amber-500',
    };

    return (
        <div className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
            <div className={`mt-2 w-2 h-2 rounded-full ${dotColors[color]} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
            <div>
                <h4 className="text-sm font-medium text-white">{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
        </div>
    );
};

const GrowthBar = ({ label, percent, change, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300 font-medium">{label}</span>
            <span className={`font-bold ${color.includes('green') ? 'text-green-400' :
                color.includes('blue') ? 'text-blue-400' : 'text-purple-400'
                }`}>{change}</span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    </div>
);

// Custom icon for growth section title since lucide might not have exact match
const TrendingUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default AdminDashboard;
