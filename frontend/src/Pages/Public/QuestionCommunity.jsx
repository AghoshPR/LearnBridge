import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, User, Code, Database, PenTool, Layout, TrendingUp, Camera, ThumbsUp, MessageSquare, Menu, X, ChevronRight, LogOut, Heart, BookOpen, Package, Plus, Eye } from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";

const QuestionCommunity = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Recent');

  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const popularTags = [
    'react', 'javascript', 'python', 'typescript', 'node.js', 'css', 'html', 'database', 'api', 'backend'
  ];

  const questions = [
    {
      id: 1,
      title: 'How to implement authentication with JWT in React?',
      tags: ['react', 'jwt', 'authentication'],
      author: 'Alex Johnson',
      time: '2 hours ago',
      votes: 12,
      answers: 5,
      views: 234,
      authorColor: 'bg-blue-600'
    },
    {
      id: 2,
      title: 'Best practices for state management in large React applications',
      tags: ['react', 'state-management', 'redux'],
      author: 'Maria Garcia',
      time: '5 hours ago',
      votes: 24,
      answers: 8,
      views: 456,
      authorColor: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Understanding async/await vs Promises in JavaScript',
      tags: ['javascript', 'async', 'promises'],
      author: 'David Lee',
      time: '1 day ago',
      votes: 45,
      answers: 12,
      views: 789,
      authorColor: 'bg-blue-600'
    },
    {
      id: 4,
      title: 'How to optimize database queries in PostgreSQL?',
      tags: ['database', 'postgresql', 'optimization'],
      author: 'Sarah Thompson',
      time: '2 days ago',
      votes: 31,
      answers: 7,
      views: 567,
      authorColor: 'bg-blue-600'
    },
    {
      id: 5,
      title: 'CSS Grid vs Flexbox: When to use which?',
      tags: ['css', 'layout', 'design'],
      author: 'Michael Brown',
      time: '3 days ago',
      votes: 58,
      answers: 15,
      views: 892,
      authorColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="text-blue-600 font-semibold transition-colors">Q&A Community</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">{isAuthenticated ? `Hi, ${username}` : "User"}</span>
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
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
                      <User className='w-4 h-4' />
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
                    <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Package className="w-4 h-4" />
                      Orders
                    </button>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/student/login", { replace: true });
                        toast.success("Logged out successfully 👋", {
                          description: "See you again!",
                          duration: 2500,
                        });
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

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <button onClick={() => navigate("/courses")} className="text-gray-700 font-medium">Explore</button>
            <Link to="/question-community" className="text-gray-700 font-medium">Q&A Community</Link>
            <a href="#" className="text-gray-700 font-medium">Live Classes</a>
            <hr className="border-gray-100" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated ? username?.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">{isAuthenticated ? username : "User"}</span>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Community</h1>
            <p className="text-gray-500">Get help from our community of learners and experts</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm">
            <Plus size={18} />
            Ask Question
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder=""
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Popular Tags */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          {['Recent', 'Popular', 'Unanswered', 'Trending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Questions Grid */}
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex gap-6">
              {/* Stats */}
              <div className="hidden sm:flex flex-col gap-2 min-w-[3rem] text-gray-400">
                <div className="flex items-center gap-1.5" title="Votes">
                  <ThumbsUp size={16} className={question.votes > 0 ? "text-blue-500" : ""} />
                  <span className={`text-sm font-semibold ${question.votes > 0 ? "text-gray-700" : ""}`}>{question.votes}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Answers">
                  <MessageSquare size={16} />
                  <span className="text-sm font-semibold">{question.answers}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Views">
                  <Eye size={16} />
                  <span className="text-sm font-semibold">{question.views}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors leading-tight">
                  {question.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${question.authorColor} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>
                    {question.author.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span className="text-gray-700">{question.author}</span>
                    <span>•</span>
                    <span>{question.time}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Stats (only visible on extra small screens if needed, otherwise hidden) */}
              <div className="sm:hidden flex flex-col justify-between items-end text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} /> {question.votes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} /> {question.answers}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuestionCommunity;