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
    Trash,
    Pencil,
    Eye
} from 'lucide-react';

const AdminTeachers = () => {

    const [pendingTeachers, setPendingTeacher] = useState([])
    const [approvedTeacher, setApproveTeacher] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [teacherToBlock, setTeacherToBlock] = useState(null);
    const [teacherToUnblock, setTeacherToUnblock] = useState(null);
    const [teacherToApprove, setTeacherToApprove] = useState(null);
    const [teacherToView, setTeacherToView] = useState(null);
    const [teacherType, setTeacherType] = useState('fresher'); // 'fresher' | 'experienced'
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // admin teacher add

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        qualification: "",
        subjects: "",
        bio: "",
        years_of_experience: ""
    });




    const handleCreateTeacher = async (e) => {

        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const payload = new FormData()

        payload.append("username", formData.username);
        payload.append("email", formData.email);
        payload.append("password", formData.password);
        payload.append("teacher_type", teacherType);
        payload.append("qualification", formData.qualification);
        payload.append("subjects", formData.subjects);
        payload.append("bio", formData.bio);

        if (teacherType === "experienced") {
            payload.append(
                "years_of_experience",
                formData.years_of_experience
            );
        }


        try {
            await Api.post("/admin/teachers/create/", payload, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success("Teacher created successfully");
            setIsCreateModalOpen(false);
            fetchApprovedTeachers();
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to create teacher"
            );
        }

    }


    // admin teacher add

    // reject modal state
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [teacherToReject, setTeacherToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");


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

    const handleApproveClick = (teacher) => {
        setTeacherToApprove(teacher);
    }

    const confirmApproveAction = async () => {
        if (!teacherToApprove) return;
        try {
            await Api.post(`/admin/teachers/approve/${teacherToApprove.id}/`)

            toast.success("Teacher approved successfully");

            fetchPendingTeachers()
            fetchApprovedTeachers()
            setTeacherToApprove(null);
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Approval failed"
            );
        }

    }


    /* ---------------- REJECT TEACHER ---------------- */

    const handleRejectClick = (teacher) => {
        setTeacherToReject(teacher);
        setIsRejectModalOpen(true);
    };

    const confirmRejectAction = async () => {
        if (!teacherToReject) return;



        if (!rejectionReason.trim()) {
            toast.error("Rejection reason is required");
            return;
        }

        try {
            await Api.post(`/admin/teachers/reject/${teacherToReject.id}/`, {
                reason: rejectionReason
            });
            toast.info("Teacher Rejected successfully");
            fetchPendingTeachers();
            setIsRejectModalOpen(false);
            setTeacherToReject(null);
            setRejectionReason("");
        }
        catch (err) {
            console.log(err.response);
            toast.error(
                err.response?.data?.error || "Rejection failed"
            );
        }
    }

    const handleBlockClick = (teacher) => {
        setTeacherToBlock(teacher);
    };

    const confirmBlockAction = async () => {
        if (!teacherToBlock) return;

        try {
            await Api.post(`/admin/teachers/block/${teacherToBlock.id}/`)
            toast.success("Teacher Blocked successfully");
            fetchApprovedTeachers()
            setTeacherToBlock(null);
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to block teacher"
            );
        }
    }

    const handleUnblockClick = (teacher) => {
        setTeacherToUnblock(teacher);
    };

    const confirmUnblockAction = async () => {
        if (!teacherToUnblock) return;

        try {
            await Api.post(`/admin/teachers/unblock/${teacherToUnblock.id}/`)
            toast.success("Teacher UnBlocked successfully");
            fetchApprovedTeachers()
            setTeacherToUnblock(null);
        } catch (err) {
            toast.error("Unblock failed")
        }
    }


    /* ---------------- DELETE TEACHER ---------------- */

    const handleDeleteClick = (teacher) => {
        setTeacherToDelete(teacher);
    };

    const handleViewClick = (teacher) => {
        setTeacherToView(teacher);
    };

    const confirmDeleteAction = async () => {
        if (!teacherToDelete) return;

        try {
            await Api.delete(`/admin/teachers/delete/${teacherToDelete.id}/`);

            toast.success("Teacher deleted successfully");

            setApproveTeacher(approvedTeacher.filter(t => t.id !== teacherToDelete.id));
            setPendingTeacher(pendingTeachers.filter(t => t.id !== teacherToDelete.id));

            setTeacherToDelete(null);
            fetchApprovedTeachers();
            fetchPendingTeachers();

        } catch (err) {
            toast.error("Failed to delete teacher");
            console.error(err);
        }
    };



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
                        onClick={() => navigate("/admin/courses")}
                    />

                    <NavItem
                        icon={Folder}
                        label="Categories"
                        onClick={() => navigate("/admin/categories")}
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
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Name</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Email</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Expertise</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Experience</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Applied</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm">

                                    {filteredPendingTeachers.map((teacher) => (

                                        <tr key={teacher.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                            <td className="px-3 py-3 font-medium text-white">{teacher.name}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.email}</td>
                                            <td className="px-3 py-3 text-gray-300">{teacher.subjects}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.experience}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.applied_at}</td>
                                            <td className="px-3 py-3">

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveClick(teacher)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                        <CheckCircle size={14} /> Approve
                                                    </button>


                                                    <button
                                                        onClick={() => handleRejectClick(teacher)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewClick(teacher)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                        <Eye size={14} /> View
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
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Name</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Email</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Expertise</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Courses</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Students</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Rating</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800">Status</th>
                                        <th className="px-3 py-3 font-medium border-b border-gray-800 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {filteredApprovedTeachers.map((teacher) => (
                                        <tr
                                            key={teacher.id}
                                            className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                                        >
                                            <td className="px-3 py-3 font-medium text-white">{teacher.name}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.email}</td>
                                            <td className="px-3 py-3 text-gray-300">{teacher.subjects}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.courses_count}</td>
                                            <td className="px-3 py-3 text-gray-400">{teacher.students_count}</td>

                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-gray-300">{teacher.rating}</span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border
                                                    ${teacher.is_blocked
                                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    }`}>
                                                    {teacher.is_blocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>

                                            <td className="px-3 py-3">
                                                {teacher.is_blocked ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleUnblockClick(teacher)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <CheckCircle size={14} /> Unblock
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <Pencil size={14} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(teacher)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <Trash size={14} /> Delete
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleBlockClick(teacher)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <Ban size={14} /> Block
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <Pencil size={14} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(teacher)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <Trash size={14} /> Delete
                                                        </button>
                                                    </div>
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
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsCreateModalOpen(false)}
                    ></div>

                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-lg p-6 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Create New Teacher</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>


                        <form className="space-y-4" onSubmit={handleCreateTeacher}>

                            {/* NAME */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    placeholder="Enter teacher name"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="Enter email address"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    placeholder="Enter password"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    placeholder="Confirm password"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* TEACHER TYPE */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Experience Level
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer
                            ${teacherType === "fresher"
                                            ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                            : "bg-[#0F1014] border-gray-800 text-gray-400"}`}>
                                        <input
                                            type="radio"
                                            value="fresher"
                                            checked={teacherType === "fresher"}
                                            onChange={() => setTeacherType("fresher")}
                                            className="hidden"
                                        />
                                        <GradCapIcon size={18} /> Fresher
                                    </label>

                                    <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer
                            ${teacherType === "experienced"
                                            ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                            : "bg-[#0F1014] border-gray-800 text-gray-400"}`}>
                                        <input
                                            type="radio"
                                            value="experienced"
                                            checked={teacherType === "experienced"}
                                            onChange={() => setTeacherType("experienced")}
                                            className="hidden"
                                        />
                                        <Briefcase size={18} /> Experienced
                                    </label>
                                </div>
                            </div>

                            {/* QUALIFICATION */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Qualification
                                </label>
                                <input
                                    type="text"
                                    value={formData.qualification}
                                    onChange={(e) =>
                                        setFormData({ ...formData, qualification: e.target.value })
                                    }
                                    placeholder="Highest qualification"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* SUBJECTS */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Subjects
                                </label>
                                <input
                                    type="text"
                                    value={formData.subjects}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subjects: e.target.value })
                                    }
                                    placeholder="Subjects teacher can teach"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* BIO */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Bio
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, bio: e.target.value })
                                    }
                                    placeholder="Short introduction"
                                    className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                />
                            </div>

                            {/* EXPERIENCE */}
                            {teacherType === "experienced" && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                        Experience (Years)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.years_of_experience}
                                        onChange={(e) =>
                                            setFormData({ ...formData, years_of_experience: e.target.value })
                                        }
                                        className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5"
                                    />
                                </div>
                            )}

                            {/* RESUME */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                                    Resume / CV
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                        setFormData({ ...formData, resume: e.target.files[0] })
                                    }
                                    className="w-full text-gray-400"
                                />
                            </div>

                            {/* ACTIONS */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold"
                                >
                                    Create Teacher
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {teacherToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTeacherToDelete(null)}></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <Trash className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Teacher?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete <span className="text-white font-semibold">{teacherToDelete.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setTeacherToDelete(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAction}
                                    className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Reason Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setIsRejectModalOpen(false);
                            setRejectionReason("");
                        }}
                    ></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Reject Application</h3>
                            <button
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectionReason("");
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-4">
                                Please provide a reason for rejecting <span className="text-white font-semibold">{teacherToReject?.name}</span>'s application.
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full h-32 bg-[#0F1014] border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-600 resize-none text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectionReason("");
                                }}
                                className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRejectAction}
                                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Send Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Confirmation Modal */}
            {teacherToApprove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTeacherToApprove(null)}></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Approve Teacher?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to approve <span className="text-white font-semibold">{teacherToApprove.name}</span>? They will get access to teacher features.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setTeacherToApprove(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmApproveAction}
                                    className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {teacherToBlock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTeacherToBlock(null)}></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <Ban className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Block Teacher?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to block <span className="text-white font-semibold">{teacherToBlock.name}</span>? They will not be able to access their account.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setTeacherToBlock(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBlockAction}
                                    className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Block
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Unblock Confirmation Modal */}
            {teacherToUnblock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTeacherToUnblock(null)}></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Unblock Teacher?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to unblock <span className="text-white font-semibold">{teacherToUnblock.name}</span>? They will regain access to their account.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setTeacherToUnblock(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUnblockAction}
                                    className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Unblock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Teacher Details Modal (Dummy) */}
            {teacherToView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setTeacherToView(null)}
                    ></div>
                    <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-3xl p-6 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
                            <div>
                                <h3 className="text-xl font-bold text-white">Teacher Application Details</h3>
                                <p className="text-gray-400 text-xs mt-0.5">Review applicant information</p>
                            </div>
                            <button
                                onClick={() => setTeacherToView(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Grid - Compact 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Col 1: Personal Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                    <p className="text-sm font-medium text-white">{teacherToView.name}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                                    <p className="text-white flex items-center gap-2">
                                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs">{teacherToView.email}</span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Applied Date</label>
                                    <p className="text-xs text-gray-300">{teacherToView.applied_at || "N/A"}</p>
                                </div>
                            </div>

                            {/* Col 2: Professional Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Experience Level</label>
                                    <div className="flex items-center gap-2">
                                        {teacherToView.experience === "Fresher" || teacherToView.experience === "0" ? (
                                            <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-md text-xs font-medium border border-purple-500/20">
                                                <GradCapIcon size={12} /> Fresher
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md text-xs font-medium border border-amber-500/20">
                                                <Briefcase size={12} /> {teacherToView.experience} Years
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subject Expertise</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(teacherToView.subjects || "").split(',').map((subject, idx) => (
                                            <span key={idx} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full text-[10px] border border-gray-700">
                                                {subject.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Col 3: Qualifications (Moved here for compactness) */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Qualifications</label>
                                    <div className="bg-[#0F1014] p-3 rounded-lg border border-gray-800 text-gray-300 text-xs leading-relaxed">
                                        <p>{teacherToView.qualification || "Bachelor of Science in Computer Science, Master of Computer Applications (MCA)"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Width Section: Documents */}
                        <div className="mt-6 space-y-4 border-t border-gray-800 pt-4">
                            <div>
                                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Verification Documents</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-between p-3 bg-[#0F1014] border border-gray-800 rounded-xl w-full hover:border-blue-500/30 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Resume/CV.pdf</p>
                                                <p className="text-[10px] text-gray-500">2.4 MB • PDF File</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                            <button
                                onClick={() => setTeacherToView(null)}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

// Reused helper component from AdminDashboard
const NavItem = ({ icon, label, active = false, onClick }) => {
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
