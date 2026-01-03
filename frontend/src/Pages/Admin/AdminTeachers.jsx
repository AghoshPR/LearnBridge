import React,{useState,useEffect} from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../../Store/authSlice';


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
    Star
} from 'lucide-react';

const AdminTeachers = () => {

    const [pendingTeachers,setPendingTeacher]=useState([])
    const [approvedTeacher,setApproveTeacher]=useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();



    /* ---------------- FETCH PENDING TEACHERS ---------------- */

    const fetchPendingTeachers = async ()=>{

        try{
            const res = await Api.get("/admin/teachers/pending/")
            setPendingTeacher(res.data)

        }catch(err){
            console.error("failed to loead teachers");
            
        }
    }


    /* ---------------- FETCH APPROVE TEACHER ---------------- */

    const fetchApprovedTeachers = async ()=>{
        try{
            const res = await Api.get("/admin/teachers/approved/")
            setApproveTeacher(res.data)

        }catch(err){
            console.error("failed to load approved teachers");
            
        }

    }

    useEffect(()=>{
        fetchPendingTeachers()
        fetchApprovedTeachers()
    },[])

    

    /* ---------------- APPROVE TEACHER ---------------- */


    const approveTeacher = async (id)=>{

        try{
            await Api.post(`/admin/teachers/approve/${id}/`)
            fetchPendingTeachers()
        }catch(err){
            alert("approval Failed")
        }

    }

    
    /* ---------------- REJECT TEACHER ---------------- */



        const rejectTeacher = async (id)=>{
            try{
                await Api.post(`/admin/teachers/reject/${id}/`)
                fetchPendingTeachers()
            }
            catch(err){
                alert(err.response?.data?.error ||"Rejection failed")
            }
        }

        const blockTeacher = async(id)=>{

            try{
                await Api.post(`/admin/teachers/block/${id}/`)
                fetchApprovedTeachers()
            }catch(err){
                alert("Block failed")
            }

            
        }

        const unBlockTeacher = async(id)=>{

            try{
                await Api.post(`/admin/teachers/unblock/${id}/`)
                fetchApprovedTeachers()
            }catch(err){
                alert("Unblock failed")
            }

        }

        const handleLogout = async()=>{

            try{
                await Api.post("/logout/")
            }catch(err){
                console.log("Logout API failed");
                
            }finally{
                dispatch(logout())
                navigate("/admin/login")
            }
        }



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

                                    {pendingTeachers.map((teacher)=>(

                                        <tr key={teacher.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{teacher.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{teacher.email}</td>
                                        <td className="px-6 py-4 text-gray-300">{teacher.subjects}</td>
                                        <td className="px-6 py-4 text-gray-400">{teacher.experience}</td>
                                        <td className="px-6 py-4 text-gray-400">{teacher.applied_at}</td>
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-2">
                                                <button
                                                onClick={()=>approveTeacher(teacher.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">
                                                    <CheckCircle size={14} /> Approve
                                                </button>


                                                <button 
                                                onClick={()=>rejectTeacher(teacher.id)}
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
                                    {approvedTeacher.map((teacher) => (
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
