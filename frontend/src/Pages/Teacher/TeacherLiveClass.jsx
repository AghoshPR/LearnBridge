import React, { useState } from 'react';
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
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { logout } from '../../Store/authSlice';

const TeacherLiveClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    time: '',
    duration: '',
    link: '',
    description: ''
  });

  const upcomingClasses = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      course: "Advanced React Patterns",
      date: "2025-12-01",
      time: "3:00 PM",
      registered: 45
    },
    {
      id: 2,
      title: "TypeScript Best Practices",
      course: "TypeScript Essentials",
      date: "2025-12-02",
      time: "10:00 AM",
      registered: 38
    }
  ];

  const pastClasses = [
    {
      id: 3,
      title: "Introduction to Node.js",
      course: "Node.js Masterclass",
      datetime: "2025-11-25 at 2:00 PM",
      attended: 52
    },
    {
      id: 4,
      title: "Building REST APIs",
      course: "Full Stack Development",
      datetime: "2025-11-20 at 11:00 AM",
      attended: 48
    }
  ];

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
      navigate("/admin/login", { replace: true });
    }
  };

  const openModal = (mode, cls = null) => {
    if (mode === 'edit' && cls) {
      setIsEditMode(true);
      setFormData({
        title: cls.title || '',
        course: cls.course || '',
        date: cls.date || '',
        time: cls.time || '',
        duration: '90 min',
        link: 'https://meet.google.com/...',
        description: ''
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: '',
        course: '',
        date: '',
        time: '',
        duration: '',
        link: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    toast.success(isEditMode ? "Class updated successfully!" : "New class scheduled!");
    closeModal();
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: false },
    { icon: User, label: 'My Profile', path: '/teacher/profile', active: false },
    { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
    { icon: Video, label: 'Live Classes', path: '/teacher/liveclass', active: true },
    { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
    { icon: Users, label: 'Students', path: '/teacher/students', active: false },
    // { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
    { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Mobile Sidebar Toggle - Only visible on small screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg text-white shadow-lg"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto mt-12 md:mt-0">
          <header className="flex flex-col sm:flex-row justify-between sm:items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Classes</h1>
              <p className="text-slate-400">Schedule and manage your live teaching sessions</p>
            </div>
            <button
              onClick={() => openModal('add')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 border border-purple-400/20 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              Schedule New Class
            </button>
          </header>

          {/* Upcoming Classes */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Video size={20} className="text-purple-400" />
              <h2 className="text-xl font-bold text-white">Upcoming Classes</h2>
            </div>

            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="bg-[#1a1f34] border border-slate-800/50 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{cls.title}</h3>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold border border-purple-500/20">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{cls.course}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-purple-400" />
                        {cls.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-purple-400" />
                        {cls.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-green-400" />
                        {cls.registered}registered
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                      <Video size={16} />
                      Start Class
                    </button>
                    <button
                      onClick={() => openModal('edit', cls)}
                      className="px-4 py-2 bg-white text-slate-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
                    >
                      <Edit2 size={16} className="text-slate-500" />
                      Edit
                    </button>
                    <button className="p-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Classes */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Past Classes</h2>

            <div className="space-y-4">
              {pastClasses.map((cls) => (
                <div key={cls.id} className="bg-[#1a1f34] border border-slate-800/50 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                      <Video size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{cls.title}</h3>
                      <p className="text-slate-400 text-sm">{cls.course}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div className="text-sm font-medium text-slate-400">{cls.datetime}</div>
                    <div className="text-sm font-medium text-purple-400">{cls.attended} attended</div>
                    <span className="px-4 py-1.5 bg-transparent text-slate-500 rounded-full text-xs font-bold border border-slate-700">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Schedule/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Live Class' : 'Schedule New Class'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Class Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject/Course *</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 pr-10"
                    placeholder="12/01/2025"
                  />
                  <Calendar size={18} className="absolute right-3 top-[34px] text-gray-400" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 pr-10"
                    placeholder="--:-- --"
                  />
                  <Clock size={18} className="absolute right-3 top-[34px] text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="90 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Meeting Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-24 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
                  placeholder={!isEditMode ? "" : "Describe what will be covered in this class..."}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold transition-colors text-sm hover:bg-blue-700"
                >
                  {isEditMode ? 'Update Class' : 'Schedule Class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherLiveClass