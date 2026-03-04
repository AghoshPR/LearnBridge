import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Store/authSlice";
import { toast } from "sonner";
import Logo from "../../assets/learnbridge-logo.png";
import { useNotifications } from "../../context/NotificationContext";

import {
  ShoppingCart,
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  MessageSquare,
  X,
  User,
  Heart,
  BookOpen,
  Package,
  LogOut,
  Menu,
  Ticket,
} from "lucide-react";
import Api from "../Services/Api";

const StudentNotification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const { notifications, setNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);


  const fetchNotifications = async () => {
  try {
    const res = await Api.get("/notification/");
    setNotifications(res.data); // updates global state
  } catch (error) {
    toast.error(
      error.response?.data?.error ||
      error.message ||
      "Something went wrong"
    );
  }
};



  

  const markAsRead = async (id) => {
    try {
      await Api.post(`/notification/mark-read/${id}/`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong",
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await Api.post("/notification/mark-all-read/");

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong",
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await Api.delete(`/notification/delete/${id}/`);

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">
                LearnBridge
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/courses" className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="hover:text-blue-600 transition-colors">Q&A Community</Link>
              <Link to="/student/liveclass" className="hover:text-blue-600 transition-colors">Live Classes</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative"
            >
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-800 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-gray-100"></span>
            </button>
            <button onClick={() => navigate('/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Heart className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">
                  {isAuthenticated ? `Hi, ${username}` : "User"}
                </span>

                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {isAuthenticated && username
                    ? username.charAt(0).toUpperCase()
                    : "U"}
                </div>
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                {!isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/login")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/student/register")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" />
                      Sign Up
                    </button>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/profile")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/mycourse")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>
                    <button
                      onClick={() => navigate("/wishlist")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>
                    <button
                      onClick={() => navigate("/student/coupons")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Ticket className="w-4 h-4" />
                      Coupons
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/student/login", { replace: true });
                        toast.success("Logged out successfully 👋");
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 cursor-pointer" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <Link to="/courses" className="text-gray-700 font-medium">Explore</Link>
            <Link to="/question-community" className="text-gray-700 font-medium">Q&A Community</Link>
            <Link to="/student/liveclass" className="text-gray-700 font-medium">Live Classes</Link>
            <hr className="border-gray-100" />

            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/student/login")} className="w-full px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Sign In</button>
                <button onClick={() => navigate("/student/register")} className="w-full px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">Sign Up</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium">{username || "User"}</span>
                </div>
                <button onClick={() => navigate("/student/profile")} className="text-gray-700 font-medium text-left">Profile</button>
                <button onClick={() => navigate("/mycourse")} className="text-gray-700 font-medium text-left">My Courses</button>
                <button onClick={() => navigate("/wishlist")} className="text-gray-700 font-medium text-left">Wishlist</button>
                <button onClick={() => navigate("/student/coupons")} className="text-gray-700 font-medium text-left">Coupons</button>
                <button onClick={() => { dispatch(logout()); navigate("/student/login", { replace: true }); toast.success("Logged out successfully 👋"); }} className="text-red-600 font-medium text-left">Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Purple Banner */}
      <div className="bg-purple-500 text-white px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 flex-1">
            <Bell className="w-6 h-6 text-white/90" />
            <div>
              <h1 className="text-xl font-bold">Notifications</h1>
              <p className="text-purple-100 text-sm">
                Stay updated with your activities
              </p>
            </div>
          </div>
          <div>
            <span className="bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {notifications.filter((n) => !n.is_read).length} Unread
            </span>
          </div>
        </div>
      </div>

      {/* Notifications Content */}
      <main className="flex-1 bg-white p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-gray-800">All Notifications</h2>
          <button
            onClick={markAllAsRead}
            className="text-xs text-white bg-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border flex gap-4 transition-all ${notification.is_read ? "bg-blue-50/50 border-blue-100 hover:border-blue-200" : "bg-white border-gray-100 hover:border-gray-200"}`}
            >
              <div className="mt-1">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {notification.title}
                    </h3>
                    {notification.isNew && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <X
                      onClick={() => deleteNotification(notification.id)}
                      size={14}
                      className="cursor-pointer hover:text-gray-600"
                    />
                    <span className="opacity-50 text-xs hidden sm:inline-block"></span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-2 leading-relaxed max-w-2xl">
                  {notification.message}
                </p>
                <span className="text-xs font-medium text-gray-400">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentNotification;
