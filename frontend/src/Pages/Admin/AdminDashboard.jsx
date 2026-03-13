/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/Store/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Api from "../Services/Api";
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
  X,
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    total_users: 0,
    active_courses: 0,
    pending_teachers: 0,
    qna_posts: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    Api.get("/admin/dashboard-stats/")
      .then((res) => {
        setStats(res.data.stats);
        setRecentUsers(res.data.recent_users);
        setRecentCourses(res.data.recent_courses);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats", err);
      });
  }, []);

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
      <aside
        className={`
                w-64 bg-[#0A0B0F] border-r border-gray-800 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">
                LearnBridge
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active
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
          <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 select-none">
            <div className="bg-[#0A0B0F] p-3 rounded-[10px] flex items-center justify-between group-hover:bg-[#13151b] transition-colors relative">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-none">
                    Admin
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">
                    Super User
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
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
            value={stats.total_users || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Courses"
            value={stats.active_courses || 0}
            icon={BookOpen}
            color="green"
          />
          <StatsCard
            title="Pending Teachers"
            value={stats.pending_teachers || 0}
            icon={GraduationCap}
            color="orange"
          />
          <StatsCard
            title="Q&A Posts"
            value={stats.qna_posts || 0}
            icon={MessageSquare}
            color="purple"
          />
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-[#111216] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-white">Recent Users</h2>
              </div>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs uppercase">
                      {user.username.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent users.
                </p>
              )}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-[#111216] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-white">Recent Courses</h2>
              </div>
              <button
                onClick={() => navigate("/admin/courses")}
                className="text-sm text-green-500 hover:text-green-400"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col gap-1 py-2 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-200 truncate pr-4">
                      {course.title}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${course.status === "published" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-400"}`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>By {course.teacher}</span>
                    <span>
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {recentCourses.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent courses.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}
    `}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-sm font-medium ${active ? "font-semibold" : ""}`}>
      {label}
    </span>
  </div>
);

const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    orange: "text-amber-500 bg-amber-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <div className="bg-[#111216] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
};

export default AdminDashboard;
