import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../../Store/authSlice';
import { toast } from "sonner";

import Api from '../Services/Api';




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
    Star,
    Search,
    X,
    Upload,
    Briefcase,
    GraduationCap as GradCapIcon,

} from 'lucide-react';

const AdminTeachers = () => {

    const [pendingTeachers, setPendingTeacher] = useState([])
    const [approvedTeacher, setApproveTeacher] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teacherType, setTeacherType] = useState('fresher'); // 'fresher' | 'experienced'
    const dispatch = useDispatch();
    const navigate = useNavigate();



    /* ---------------- FETCH PENDING TEACHERS ---------------- */

    const fetchPendingTeachers = async () => {

        try {
            const res = await Api.get("/admin/teachers/pending/")
            setPendingTeacher(res.data)

        } catch (err) {
            console.error("failed to loead teachers");

        }
    }


    /* ---------------- FETCH APPROVE TEACHER ---------------- */

    const fetchApprovedTeachers = async () => {
        try {
            const res = await Api.get("/admin/teachers/approved/")
            setApproveTeacher(res.data)

        } catch (err) {
            console.error("failed to load approved teachers");

        }

    }

    useEffect(() => {
        fetchPendingTeachers()
        fetchApprovedTeachers()
    }, [])



    /* ---------------- APPROVE TEACHER ---------------- */


    const approveTeacher = async (id) => {

        try {
            await Api.post(`/admin/teachers/approve/${id}/`)

            toast.success("Teacher approved successfully");

            fetchPendingTeachers()
            fetchApprovedTeachers()
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Approval failed"
            );
        }

    }


    /* ---------------- REJECT TEACHER ---------------- */



    const rejectTeacher = async (id) => {
        try {
            await Api.post(`/admin/teachers/reject/${id}/`)
            toast.info("Teacher Rejected successfully");

            fetchPendingTeachers()
        }
        catch (err) {
            toast.error(
                err.response?.data?.error || "Rejection failed"
            );
        }
    }

    const blockTeacher = async (id) => {

        try {
            await Api.post(`/admin/teachers/block/${id}/`)
            toast.error("Teacher Blocked successfully");
            fetchApprovedTeachers()
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to block teacher"
            );
        }


    }

    const unBlockTeacher = async (id) => {

        try {
            await Api.post(`/admin/teachers/unblock/${id}/`)
            toast.success("Teacher UnBlocked successfully");
            fetchApprovedTeachers()
        } catch (err) {
            alert("Unblock failed")
        }

    }

    

    const handleLogout = async () => {
        try {
            await Api.post("/auth/logout/");
    
            toast.success("Logged out successfully 👋", {
            description: "See you again, Admin!",
            duration: 2500,
            });
    
        } catch (err) {
            toast.error("Logout failed", {
            description: "Something went wrong. Please try again.",
            });
        } finally {
            dispatch(logout()); // Redux clear
            navigate("/admin/login", { replace: true });
        }

    }


    // Filter functions
    const filteredPendingTeachers = pendingTeachers.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredApprovedTeachers = approvedTeacher.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                    <NavItem
                                        icon={LayoutDashboard}
                                        label="Dashboard"
                                        onClick={() => navigate("/admin/dashboard")}
                                    />
                
                                    <NavItem
                                        icon={BookOpen}
                                        label="Courses"
                                        // onClick={() => navigate("/admin/courses")}
                                    />
                
                                    <NavItem
                                        icon={Folder}
                                        label="Categories"
                                        // onClick={() => navigate("/admin/categories")}
                                    />
                
                                    <NavItem
                                        icon={Users}
                                        label="Users"
                                        onClick={() => navigate("/admin/users")}
                                    />
                
                                    <NavItem
                                        icon={GraduationCap}
                                        label="Teachers"
                                        active
                                        onClick={() => navigate("/admin/teachers")}
                                    />
                
                                    <NavItem
                                        icon={MessageSquare}
                                        label="Q&A Moderation"
                                        // onClick={() => navigate("/admin/qna")}
                                    />
                
                                    <NavItem
                                        icon={Tag}
                                        label="Tags Management"
                                        // onClick={() => navigate("/admin/tags")}
                                    />
                
                                    <NavItem
                                        icon={Percent}
                                        label="Offers"
                                        // onClick={() => navigate("/admin/offers")}
                                    />
                
                                    <NavItem
                                        icon={Ticket}
                                        label="Coupons"
                                        // onClick={() => navigate("/admin/coupons")}
                                    />
                
                                    <NavItem
                                        icon={Wallet}
                                        label="Wallet"
                                        // onClick={() => navigate("/admin/wallet")}
                                    />
                
                                    <NavItem
                                        icon={Settings}
                                        label="Settings"
                                        // onClick={() => navigate("/admin/settings")}
                                    />
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

                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Logout"
                            >
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
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        Create Teacher
                    </button>
                </header>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative bg-[#0F1014] rounded-xl border border-gray-800 focus-within:border-blue-500/50 transition-colors w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-transparent text-gray-200 py-3.5 pl-12 pr-4 outline-none placeholder-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Pending Approvals Table */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white">Pending Approvals {pendingTeachers.length}</h2>
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

                                    {filteredPendingTeachers.map((teacher) => (

                                        <tr key={teacher.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{teacher.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.email}</td>
                                            <td className="px-6 py-4 text-gray-300">{teacher.subjects}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.experience}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.applied_at}</td>
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => approveTeacher(teacher.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                        <CheckCircle size={14} /> Approve
                                                    </button>


                                                    <button
                                                        onClick={() => rejectTeacher(teacher.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                        <XCircle size={14} /> Reject
                                                    </button>

                                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors">
                                                        <Ban size={14} /> Block
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                    ))}






                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Approved Teachers Table */}
                    <div className="bg-[#111216] border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white">Approved Teachers {approvedTeacher.length}</h2>
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
                                    {filteredApprovedTeachers.map((teacher) => (
                                        <tr
                                            key={teacher.id}
                                            className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-white">{teacher.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.email}</td>
                                            <td className="px-6 py-4 text-gray-300">{teacher.subjects}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.courses_count}</td>
                                            <td className="px-6 py-4 text-gray-400">{teacher.students_count}</td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-gray-300">{teacher.rating}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border
                                                    ${teacher.is_blocked
                                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    }`}>
                                                    {teacher.is_blocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {teacher.is_blocked ? (
                                                    <button
                                                        onClick={() => unBlockTeacher(teacher.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        <CheckCircle size={14} /> Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => blockTeacher(teacher.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        <Ban size={14} /> Block
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </main>

            {/* Create Teacher Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-lg p-6 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Create New Teacher</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Name</label>
                                <input type="text" placeholder="Enter teacher name" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                                <input type="email" placeholder="Enter email address" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
                                <input type="password" placeholder="Enter password" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                                <input type="password" placeholder="Confirm password" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                            </div>

                            {/* Teacher Type Toggle */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Experience Level</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`
                                        flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                        ${teacherType === 'fresher'
                                            ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                                            : 'bg-[#0F1014] border-gray-800 text-gray-400 hover:border-gray-700'}
                                    `}>
                                        <input
                                            type="radio"
                                            name="teacherType"
                                            value="fresher"
                                            className="hidden"
                                            checked={teacherType === 'fresher'}
                                            onChange={(e) => setTeacherType(e.target.value)}
                                        />
                                        <GradCapIcon size={18} />
                                        <span className="font-medium text-sm">Fresher</span>
                                    </label>
                                    <label className={`
                                        flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                        ${teacherType === 'experienced'
                                            ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                                            : 'bg-[#0F1014] border-gray-800 text-gray-400 hover:border-gray-700'}
                                    `}>
                                        <input
                                            type="radio"
                                            name="teacherType"
                                            value="experienced"
                                            className="hidden"
                                            checked={teacherType === 'experienced'}
                                            onChange={(e) => setTeacherType(e.target.value)}
                                        />
                                        <Briefcase size={18} />
                                        <span className="font-medium text-sm">Experienced</span>
                                    </label>
                                </div>
                            </div>


                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Expertise</label>
                                <input type="text" placeholder="e.g. Web Development" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                            </div>

                            {teacherType === 'experienced' && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Experience (Years)</label>
                                    <input type="number" placeholder="e.g. 5" className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
                                </div>
                            )}

                            {/* Resume Upload - Always visible as requested */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Resume / CV</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 bg-[#0F1014] border-2 border-gray-700 border-dashed rounded-xl cursor-pointer hover:bg-gray-800/50 hover:border-gray-600 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="bg-gray-800 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <p className="mb-1 text-sm text-gray-400"><span className="font-semibold text-blue-500">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PDF, DOC (MAX. 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                                </label>
                            </div>


                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Create Teacher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

// Reused helper component from AdminDashboard
const NavItem = ({ icon, label, active = false,onClick }) => {
    const Icon = icon;
    return (
        <div 
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
            ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
        `}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
        </div>
    );
};

export default AdminTeachers;
