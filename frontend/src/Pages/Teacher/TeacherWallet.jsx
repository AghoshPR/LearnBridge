import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  BookOpen,
  MessageSquare,
  Users,
  BarChart2,

  Wallet,
  LogOut,
  Folder,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  CheckCircle2,
  Video
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { logout } from '../../Store/authSlice';

const TeacherWallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: false },
    { icon: User, label: 'My Profile', path: '/teacher/profile', active: false },
    { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
    // { icon: Folder, label: 'Categories', path: '/teacher/coursecategory', active: false },
    { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
    { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
    { icon: Users, label: 'Students', path: '/teacher/students', active: false },
    { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
    { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: true },
  ];

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


  useEffect(()=>{
    fetchWallet()
  },[])

  const [walletSummary, setWalletSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async()=>{
    try{

        const [summaryRes,txRes] = await Promise.all([
          Api.get("wallet/summarydetails/"),
          Api.get("wallet/transactionsdetails/")
        ])

        setWalletSummary(summaryRes.data)
        setTransactions(txRes.data)

    }catch(err){
      toast.error("failed to load wallet")
    }

  }

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
              onClick={() => navigate(item.path)}
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-slate-400">Manage your earnings and transactions</p>
        </header>

        {/* Revenue Share Banner */}
        <div className="bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] rounded-xl p-4 mb-8 flex items-center justify-between text-slate-950">
          <div>
            <span className="font-bold mr-2">Your Revenue Share:</span>
            <span className="text-sm font-medium opacity-80">Course Sales: <span className="font-bold text-green-800">80%</span>  |  Live Classes: <span className="font-bold text-green-800">80%</span></span>
          </div>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Earnings */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/20"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1">Total Earnings</p>
              <h2 className="text-3xl font-bold text-emerald-400">₹{walletSummary?.total_earnings ?? 0}</h2>
              <ArrowUpRight className="absolute bottom-6 right-6 text-emerald-500/50 w-6 h-6" />
            </div>
          </div>

          {/* Available Balance */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-blue-500/20"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold text-blue-400">₹{walletSummary?.available_balance ?? 0}</h2>
              <DollarSign className="absolute bottom-6 right-6 text-blue-500/50 w-6 h-6" />
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-amber-500/20"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1">Pending Payments</p>
              <h2 className="text-3xl font-bold text-amber-400">₹{walletSummary?.pending_balance ?? 0}</h2>
              <Clock className="absolute bottom-6 right-6 text-amber-500/50 w-6 h-6" />
            </div>
          </div>

          {/* Live Class Revenue */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-purple-500/20"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1">Live Class Revenue</p>
              <h2 className="text-3xl font-bold text-purple-400">₹400</h2>
              <Video className="absolute bottom-6 right-6 text-purple-500/50 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">{transaction.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${transaction.source === 'Course Sale' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          transaction.source === 'Live Class' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {transaction.source}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${transaction.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${transaction.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                          {transaction.status}
                        </span>
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

export default TeacherWallet;