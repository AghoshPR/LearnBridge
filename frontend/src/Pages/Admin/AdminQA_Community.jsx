import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { logout } from '@/Store/authSlice';
import { useDispatch } from 'react-redux';
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
  Search,
  CheckCircle,
  Trash,
  AlertTriangle
} from 'lucide-react';
import Api from '../Services/Api';

const AdminQA_Community = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'reported'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Mock Data
  const [allQuestions] = useState([
    {
      id: 1,
      question: "React hooks vs class components",
      author: "Mike Johnson",
      answers: 12,
      views: 450,
      status: "active",
      date: "2024-05-09"
    },
    {
      id: 2,
      question: "Node.js authentication best practices",
      author: "Sarah Williams",
      answers: 8,
      views: 320,
      status: "active",
      date: "2024-05-08"
    },
    {
      id: 3,
      question: "How to center a div in CSS?",
      author: "John Doe",
      answers: 25,
      views: 1200,
      status: "active",
      date: "2024-05-07"
    }
  ]);

  const [reportedQuestions, setReportedQuestions] = useState([
    {
      id: 101,
      question: "How to center a div in CSS?",
      author: "John Doe",
      reports: 3,
      reason: "Spam",
      date: "2024-05-10"
    },
    {
      id: 102,
      question: "Best framework for 2024?",
      author: "Jane Smith",
      reports: 5,
      reason: "Off-topic",
      date: "2024-05-11"
    }
  ]);

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
      dispatch(logout());
      navigate("/admin/login", { replace: true });
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (activeTab === 'reported') {
      setReportedQuestions(reportedQuestions.filter(q => q.id !== selectedItem.id));
    } else {
      // In a real app, you'd probably delete from both or fetch fresh data
      toast.error("Cannot delete from all questions in this demo");
    }
    setDeleteModalOpen(false);
    setSelectedItem(null);
    toast.success("Question deleted successfully");
  };

  const handleApprove = (id) => {
    setReportedQuestions(reportedQuestions.filter(q => q.id !== id));
    toast.success("Question approved/kept");
  };

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
            onClick={() => navigate("/admin/teachers")}
          />

          <NavItem
            icon={MessageSquare}
            label="Q&A Moderation"
            active
            onClick={() => navigate("/admin/qna")}
          />

          <NavItem
            icon={Tag}
            label="Tags Management"
            onClick={() => navigate("/admin/tags")}
          />

          <NavItem
            icon={Percent}
            label="Offers"
            onClick={() => navigate("/admin/offers")}
          />

          <NavItem
            icon={Ticket}
            label="Coupons"
            onClick={() => navigate("/admin/coupons")}
          />

          <NavItem
            icon={Wallet}
            label="Wallet"
            onClick={() => navigate("/admin/wallet")}
          />
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
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Q&A Moderation</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reported')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reported'
                  ? 'bg-[#1e293b] text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              Reported ({reportedQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all'
                  ? 'bg-[#1e293b] text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              All Questions
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-[#0F1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#131418]">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Author</th>
                  {activeTab === 'reported' ? (
                    <>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Answers</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {activeTab === 'reported' ? (
                  reportedQuestions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                          <span className="text-sm font-medium text-white">{item.question}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.author}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                          {item.reports} reports
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Trash size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  allQuestions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{item.question}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.answers}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.views}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.date}</td>
                      <td className="px-6 py-4">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:text-red-400 text-gray-500 transition-colors"
                        >
                          <X size={14} className="border rounded-full border-current p-0.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)}></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl border-red-500/20">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <Trash size={24} />
              <h3 className="text-xl font-bold text-white">Delete Question</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this question?
              <br />
              <span className="text-white font-medium mt-1 block">"{selectedItem.question}"</span>
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

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

export default AdminQA_Community;