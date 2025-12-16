import React from 'react';
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
    Plus,
    CheckCircle,
    XCircle,
    Ban,
    Star
} from 'lucide-react';

const AdminTeachers = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex font-sans text-gray-100">

            {/* Sidebar (Reused) */}
            <aside className="w-64 bg-[#0A0B0F] border-r border-gray-800 flex flex-col fixed h-full z-20">
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

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" />
                    <NavItem icon={BookOpen} label="Courses" />
                    <NavItem icon={Folder} label="Categories" />
                    <NavItem icon={Users} label="Users" />
                    <NavItem icon={GraduationCap} label="Teachers" active />
                    <NavItem icon={MessageSquare} label="Q&A Moderation" />
                    <NavItem icon={Tag} label="Tags Management" />
                    <NavItem icon={Percent} label="Offers" />
                    <NavItem icon={Ticket} label="Coupons" />
                    <NavItem icon={Wallet} label="Wallet" />
                    <NavItem icon={Settings} label="Settings" />
                </nav>

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
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">

                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Teacher Management</h1>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                        <Plus size={18} />
                        Create Teacher
                    </button>
                </header>

                <div className="space-y-8">
                    {/* Pending Approvals Table */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white">Pending Approvals (2)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#16181D] text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Name</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Email</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Expertise</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Experience</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Applied</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">Emma Wilson</td>
                                        <td className="px-6 py-4 text-gray-400">emma@example.com</td>
                                        <td className="px-6 py-4 text-gray-300">Web Development</td>
                                        <td className="px-6 py-4 text-gray-400">5 years</td>
                                        <td className="px-6 py-4 text-gray-400">2024-05-01</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors">
                                                    <Ban size={14} /> Block
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">Michael Chen</td>
                                        <td className="px-6 py-4 text-gray-400">michael@example.com</td>
                                        <td className="px-6 py-4 text-gray-300">Data Science</td>
                                        <td className="px-6 py-4 text-gray-400">8 years</td>
                                        <td className="px-6 py-4 text-gray-400">2024-05-03</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors">
                                                    <Ban size={14} /> Block
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Approved Teachers Table */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white">Approved Teachers (2)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#16181D] text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Name</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Email</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Expertise</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Courses</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Students</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Rating</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Status</th>
                                        <th className="px-6 py-4 font-medium border-b border-gray-800">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">Dr. Angela Yu</td>
                                        <td className="px-6 py-4 text-gray-400">angela@example.com</td>
                                        <td className="px-6 py-4 text-gray-300">Full Stack Development</td>
                                        <td className="px-6 py-4 text-gray-400">12</td>
                                        <td className="px-6 py-4 text-gray-400">245,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-gray-300">4.8</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-semibold">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors">
                                                <Ban size={14} /> Block
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">John Smith</td>
                                        <td className="px-6 py-4 text-gray-400">john@example.com</td>
                                        <td className="px-6 py-4 text-gray-300">React & Frontend</td>
                                        <td className="px-6 py-4 text-gray-400">8</td>
                                        <td className="px-6 py-4 text-gray-400">95,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-gray-300">4.7</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-semibold">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors">
                                                <Ban size={14} /> Block
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

// Reused helper component from AdminDashboard
const NavItem = ({ icon, label, active = false }) => {
    const Icon = icon;
    return (
        <div className={`
            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
            ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
        `}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
        </div>
    );
};

export default AdminTeachers;
