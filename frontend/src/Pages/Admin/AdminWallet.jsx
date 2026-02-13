import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/Store/authSlice';
import { toast } from "sonner";
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
    LogOut,
    ShieldCheck,
    Menu,
    X,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    DollarSign
} from 'lucide-react';
import Api from '../Services/Api';

const AdminWallet = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [walletSummary, setWalletSummary] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        fetchWalletData()
    }, [])


    const fetchWalletData = async () => {

        try {

            const [summaryRes, txRes] = await Promise.all([
                Api.get("/wallet/summary/"),
                Api.get("/wallet/transactions/"),
            ])

            setWalletSummary(summaryRes.data)
            setTransactions(txRes.data)

        } catch (err) {
            toast.error("Failed to load wallet data")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await Api.post("/auth/logout/");
            toast.success("Logged out successfully 👋");
        } catch (err) {
            toast.error("Logout failed");
        } finally {
            dispatch(logout());
            navigate("/admin/login", { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading wallet data...
            </div>
        );
    }

    const handleTransfer = async (id) => {
        try {
            await Api.post(`/wallet/transfer/${id}/`)
            toast.success("Funds transferred successfully to Teacher Wallet! 💸");
            fetchWalletData()
        } catch (err) {
            toast.error("Transfer Failed")
        }

    };




    // Sidebar Items Component
    const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
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
                    <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate("/admin/dashboard")} />
                    <NavItem icon={BookOpen} label="Courses" onClick={() => navigate("/admin/courses")} />
                    <NavItem icon={Folder} label="Categories" onClick={() => navigate("/admin/categories")} />
                    <NavItem icon={Users} label="Users" onClick={() => navigate("/admin/users")} />
                    <NavItem icon={GraduationCap} label="Teachers" onClick={() => navigate("/admin/teachers")} />
                    <NavItem icon={MessageSquare} label="Q&A Moderation" />
                    <NavItem icon={Tag} label="Tags Management" />
                    <NavItem icon={Percent} label="Offers" onClick={() => navigate("/admin/offers")} />
                    <NavItem icon={Ticket} label="Coupons" onClick={() => navigate("/admin/coupons")} />
                    <NavItem icon={Wallet} label="Wallet" active onClick={() => navigate("/admin/wallet")} />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-800">
                    <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 select-none cursor-pointer">
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
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 lg:ml-64 p-6 md:p-10 pt-20 lg:pt-10 transition-all duration-300">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Company Wallet</h1>
                    <p className="text-gray-400">Platform revenue and transaction history</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Revenue */}
                    <div className="bg-[#0F1014] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/20"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-400 mb-1">Total Revenue</p>
                            <h2 className="text-2xl font-bold text-emerald-400">₹{walletSummary?.total_earnings ?? 0}</h2>
                            <ArrowUpRight className="absolute bottom-6 right-6 text-emerald-500/50 w-6 h-6" />
                        </div>
                    </div>

                    {/* Available Balance */}
                    <div className="bg-[#0F1014] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-blue-500/20"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-400 mb-1">Available Balance</p>
                            <h2 className="text-2xl font-bold text-blue-400">₹{walletSummary?.available_balance ?? 0}</h2>
                            <DollarSign className="absolute bottom-6 right-6 text-blue-500/50 w-6 h-6" />
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-[#0F1014] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-amber-500/20"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-400 mb-1">Pending</p>
                            <h2 className="text-2xl font-bold text-amber-400">₹{walletSummary?.pending_balance ?? 0}</h2>
                            <Clock className="absolute bottom-6 right-6 text-amber-500/50 w-6 h-6" />
                        </div>
                    </div>

                    {/* Withdrawn */}
                    <div className="bg-[#0F1014] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-purple-500/20"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-400 mb-1">Withdrawn</p>
                            <h2 className="text-2xl font-bold text-purple-400"> ₹{walletSummary?.withdrawn_amount ?? 0}</h2>
                            <ArrowDownLeft className="absolute bottom-6 right-6 text-purple-500/50 w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Wallet className="text-blue-500" size={24} />
                        <h2 className="text-xl font-bold text-white">Transaction History</h2>
                    </div>

                    <div className="bg-[#0F1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-800 bg-[#0A0B0F]/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course / Description</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tutor Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-green-400">Admin (20%)</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-blue-400">Teacher (80%)</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {transactions.map((transaction, index) => (
                                        <tr key={transaction.id} className="hover:bg-gray-800/20 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white mb-1">{transaction.courseName || "Null"}</span>
                                                    <span className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded w-fit border border-blue-500/20">{transaction.source} : {transaction.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-white">
                                                {transaction.tutorName}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-white">
                                                ₹{transaction.fullAmount}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-green-400">
                                                +₹{transaction.adminShare}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-blue-400">
                                                ₹{transaction.teacherShare || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${transaction.status === 'Completed'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : transaction.status === 'Processing'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20' // Pending
                                                    }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {transaction.status === 'transfer_pending' ? (
                                                    <button
                                                        onClick={() => handleTransfer(transaction.id)}
                                                        className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                                    >
                                                        Transfer
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-white-600 flex items-center justify-end gap-1">
                                                        <CheckCircle2 size={14} /> Transferred
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {transactions.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No transactions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminWallet;
