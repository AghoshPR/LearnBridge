import React, { useState } from 'react';
import {
  Search, ShoppingCart, Bell, User, Menu, X, ChevronRight, LogOut,
  Heart, BookOpen, Package, Star, Play, MoreVertical, MessageCircle,
  ThumbsUp, ThumbsDown, Send, Share2, Settings, Maximize,
  CheckCircle, Lock, Bot, SquarePlay
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import Logo from '../../assets/learnbridge-logo.png';

const CourseVideos = () => {
  // Navbar State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Page State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, comments, notes

  // Dummy Data
  const course = {
    title: "Complete React Course",
    lessonTitle: "Introduction to React Hooks",
    currentLesson: 3,
    totalLessons: 8,
    description: "Learn how to use React Hooks to manage state and side effects in functional components. We'll cover useState, useEffect, and custom hooks in detail with practical examples."
  };

  const playlist = [
    { id: 1, title: "1. Introduction to React", duration: "12:34", comments: 3, completed: true, thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop" },
    { id: 2, title: "2. Components & Props", duration: "15:45", comments: 1, completed: true, thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=200&h=120&fit=crop" },
    { id: 3, title: "3. State Management", duration: "22:10", comments: 0, completed: false, active: true, thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=120&fit=crop" },
    { id: 4, title: "4. Hooks Deep Dive", duration: "28:55", comments: 0, completed: false, thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&h=120&fit=crop" },
    { id: 5, title: "5. Building Custom Hooks", duration: "18:20", comments: 0, completed: false, thumbnail: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=200&h=120&fit=crop" },
  ];

  const comments = [
    { id: 1, user: "John Doe", time: "2 hours ago", text: "Great introduction! Very clear explanation of React basics.", likes: 12, replies: 0, initial: "J", color: "bg-purple-100 text-purple-600" },
    { id: 2, user: "Jane Smith", time: "1 hour ago", text: "I agree! This helped me understand React much better.", likes: 3, replies: 0, initial: "J", color: "bg-green-100 text-green-600" },
    { id: 3, user: "Mike Johnson", time: "5 hours ago", text: "Could you explain more about virtual DOM in the next video?", likes: 8, replies: 0, initial: "M", color: "bg-blue-100 text-blue-600" },
  ];

  const dummyReviews = [
    { id: 1, user: "Sarah Jenkins", rating: 5, date: "2 days ago", text: "This course was absolutely amazing! The explanation of hooks was crystal clear. I've been struggling with useEffect for weeks and this finally made it click.", initial: "S", color: "bg-pink-100 text-pink-600" },
    { id: 2, user: "Michael Chen", rating: 4, date: "1 week ago", text: "Great content, but I wish there were more assignments to practice. The instructor is very knowledgeable though.", initial: "M", color: "bg-blue-100 text-blue-600" },
    { id: 3, user: "Jessica Williams", rating: 5, date: "2 weeks ago", text: "Best React course I've taken so far. Highly recommended for beginners! The project-based approach is really helpful.", initial: "J", color: "bg-orange-100 text-orange-600" },
    { id: 4, user: "David Thompson", rating: 3, date: "3 weeks ago", text: "Good explanation but the audio quality could be better in some videos. Content is solid otherwise.", initial: "D", color: "bg-indigo-100 text-indigo-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="hover:text-blue-600 transition-colors">Q&A Community</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative">
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Heart className="w-5 h-5" />
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
                {!isAuthenticated ? (
                  <>
                    <button onClick={() => navigate("/student/login")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <User className='w-4 h-4' /> Login
                    </button>
                    <button onClick={() => navigate("/student/register")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" /> Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" /> My Courses
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" /> Wishlist
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Package className="w-4 h-4" /> Orders
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { dispatch(logout()); navigate("/student/login", { replace: true }); toast.success("Logged out successfully 👋"); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer">
                      <LogOut className="w-4 h-4" /> Logout
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
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full z-50">
            <Link to="/courses" className="text-gray-700 font-medium">Explore</Link>
            <Link to="/question-community" className="text-gray-700 font-medium">Q&A Community</Link>
            <a href="#" className="text-gray-700 font-medium">Live Classes</a>
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
                <button className="text-gray-700 font-medium text-left">My Courses</button>
                <button onClick={() => navigate("/wishlist")} className="text-gray-700 font-medium text-left">Wishlist</button>
                <button className="text-gray-700 font-medium text-left">Orders</button>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/student/login", { replace: true });
                    toast.success("Logged out successfully 👋");
                  }}
                  className="text-red-600 font-medium text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{course.lessonTitle}</h1>
            <p className="text-gray-500 text-sm mt-1">{course.title} • Lesson {course.currentLesson} of {course.totalLessons}</p>
          </div>
          <button
            onClick={() => setShowRatingModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Star className="w-4 h-4 fill-current" />
            Leave a Rating
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Video & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
                <p className="absolute bottom-1/2 translate-y-12 text-white/50 text-sm">Click to play lesson</p>
              </div>

              {/* Video Controls Bar Mockup */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between text-white/90">
                <span className="text-xs font-mono">08:32 / 22:10</span>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="cursor-pointer hover:text-white">Speed: 1x</span>
                  <span className="cursor-pointer hover:text-white">Quality: 1080p</span>
                  <Maximize className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            {/* About This Lesson */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this lesson</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {course.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-900">Comments ({comments.length})</h3>
              </div>

              {/* Comment Input */}
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-3 mb-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-gray-100">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full bg-transparent border-none focus:outline-none text-sm resize-none h-20 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <Send className="w-3 h-3" /> Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {/* Dummy "You" comment just to match image style if needed, otherwise using mapped list */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                    Y
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">You</span>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">clsf</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600"><ThumbsUp className="w-3 h-3" /> 0</button>
                      <button className="flex items-center gap-1 hover:text-blue-600">Reply</button>
                      <button><MoreVertical className="w-3 h-3" /></button>
                    </div>

                    {/* Nested Reply */}
                    <div className="flex gap-4 mt-4 ml-4 pt-4 border-t border-gray-50">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                        Y
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">You</span>
                          <span className="text-xs text-gray-500">Just now</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">sdf</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <button className="flex items-center gap-1 hover:text-blue-600"><ThumbsUp className="w-3 h-3" /> 0</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${comment.color} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {comment.initial}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{comment.user}</span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button className="flex items-center gap-1 hover:text-blue-600"><ThumbsUp className="w-3 h-3" /> {comment.likes}</button>
                        <button className="flex items-center gap-1 hover:text-blue-600">Reply</button>
                        <button><MoreVertical className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Reviews Section (Placeholder as per image) */}
            {/* Course Reviews Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <h3 className="text-lg font-bold text-gray-900">Course Reviews</h3>
              </div>

              <div className="grid gap-6">
                {dummyReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                          {review.initial}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">• {review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mt-2 ml-13">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <button className="text-blue-600 font-semibold text-sm hover:underline">View all reviews</button>
              </div>
            </div>
          </div>

          {/* Right Column - Playlist & AI */}
          <div className="lg:col-span-1 space-y-6">

            {/* Course Playlist */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <SquarePlay className="w-4 h-4 text-blue-600" />
                    Course Playlist
                  </h3>
                </div>
                <p className="text-xs text-gray-500">8 lessons • 3h 14m total</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {playlist.map((video) => (
                  <div
                    key={video.id}
                    className={`p-3 flex gap-3 hover:bg-blue-50 transition-colors cursor-pointer border-l-2 ${video.active ? 'bg-blue-50/50 border-blue-500' : 'border-transparent'}`}
                  >
                    <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      {video.active && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-current" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded-sm">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className={`text-sm font-medium leading-tight mb-1 truncate ${video.active ? 'text-blue-700' : 'text-gray-800'}`}>
                        {video.title}
                      </h4>
                      <span className="text-xs text-gray-500 mb-auto">{video.comments} comments</span>
                      {video.completed && <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium"><CheckCircle className="w-3 h-3" /> Completed</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Learning Assistant */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden h-[500px] flex flex-col relative">
              {/* Header */}
              <div className="p-4 bg-orange-100/50 border-b border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AI Learning Assistant</h3>
                  <p className="text-[10px] text-gray-500">Always here to help</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 bg-gray-50 space-y-4 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-orange-600" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-gray-600 leading-relaxed border border-gray-100">
                    Hi! I'm your AI learning assistant. Ask me anything about this lesson!
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask about this lesson..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white hover:shadow-md transition-all">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">AI can make mistakes. Verify important information.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                <span className="text-xl font-bold text-gray-900">LearnBridge</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Empowering learners worldwide with quality education. Join our community and start your journey today.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Browse Courses</a></li>
                <li><a href="#" className="hover:text-blue-600">Live Classes</a></li>
                <li><a href="#" className="hover:text-blue-600">Q&A Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
            © 2024 LearnBridge. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Leave a Rating</h3>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Review</label>
                <div className="bg-gray-50 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-gray-200">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full bg-transparent border-none focus:outline-none text-sm resize-none h-32 placeholder-gray-400"
                  />
                  <div className="text-right text-xs text-gray-400 mt-2">
                    <span className="cursor-ew-resize">///</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Review submitted successfully!");
                  setShowRatingModal(false);
                  setRating(0);
                  setReview('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseVideos;