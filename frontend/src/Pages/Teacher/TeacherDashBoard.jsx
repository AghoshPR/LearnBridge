import React from 'react';
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
  MoreVertical,
  Star,
  Plus,
  Calendar,
  MessageCircle,
  TrendingUp,
  Book,
  Folder
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { logout } from '../../Store/authSlice';




const TeacherDashBoard = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);


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


  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: true },
    { icon: User, label: 'My Profile', path: '/teacher/profile', active: false },
    { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
    { icon: Folder, label: 'Categories', path: '/teacher/categories', active: false },
    { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
    { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
    { icon: Users, label: 'Students', path: '/teacher/students', active: false },
    { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
    { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
  ];

  const stats = [
    { title: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-blue-600' },
    { title: 'Total Students', value: '1,234', icon: Users, color: 'bg-emerald-600' },
    { title: 'Live Classes', value: '8', icon: Video, color: 'bg-purple-600' },
    { title: 'Avg Rating', value: '4.8', icon: Star, color: 'bg-yellow-600' },
  ];

  const topCourses = [
    {
      title: 'Advanced React Patterns',
      students: '234 students enrolled',
      price: '$12,340',
      rating: '4.9',
      color: 'bg-blue-600'
    },
    {
      title: 'Node.js Masterclass',
      students: '169 students enrolled',
      price: '$9,450',
      rating: '4.7',
      color: 'bg-green-600'
    },
    {
      title: 'Full Stack Development',
      students: '312 students enrolled',
      price: '$15,600',
      rating: '4.8',
      color: 'bg-purple-600'
    },
  ];

  const upcomingClasses = [
    {
      title: 'React Hooks Deep Dive',
      time: 'Today, 3:00 PM',
      registered: '45 registered'
    },
    {
      title: 'TypeScript Best Practices',
      time: 'Tomorrow, 10:00 AM',
      registered: '38 registered'
    }
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your teaching overview.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-slate-400 text-sm font-medium">{stat.title}</span>
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-20 text-white group-hover:scale-110 transition-transform`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Top Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Your Top Courses</h2>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${course.color} flex items-center justify-center text-white shadow-lg`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{course.title}</h3>
                    <p className="text-xs text-slate-400">{course.students}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-bold text-white mb-1">{course.price}</p>
                    <p className="text-xs text-slate-400">Revenue</p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-white">{course.rating}</span>
                  </div>
                  <button className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Live Classes */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Video className="text-purple-500" size={20} />
              <h2 className="text-xl font-bold text-white">Upcoming Live Classes</h2>
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white mb-2">{cls.title}</h3>
                      <p className="text-sm text-slate-400 mb-1">{cls.time}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20">
                      {cls.registered}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 w-2/3 rounded-full"></div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-900/20 transition-all flex items-center justify-center gap-2">
                Manage Live Classes
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center gap-4 text-white hover:shadow-lg hover:shadow-blue-900/20 transition-all group">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Plus size={20} />
                </div>
                <span className="font-bold">Create New Course</span>
              </button>

              <button className="w-full p-4 bg-white text-slate-900 rounded-xl flex items-center gap-4 hover:bg-slate-100 transition-all group border border-slate-200">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                  <Video size={20} />
                </div>
                <span className="font-bold">Schedule Live Class</span>
              </button>

              <button className="w-full p-4 bg-white text-slate-900 rounded-xl flex items-center gap-4 hover:bg-slate-100 transition-all group border border-slate-200">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                  <MessageCircle size={20} />
                </div>
                <span className="font-bold">Answer Questions</span>
              </button>

              <button className="w-full p-4 bg-white text-slate-900 rounded-xl flex items-center gap-4 hover:bg-slate-100 transition-all group border border-slate-200">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                  <TrendingUp size={20} />
                </div>
                <span className="font-bold">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashBoard;