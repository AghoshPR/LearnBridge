import React, { useEffect, useState } from 'react';
import {
  Search, ShoppingCart, Bell, User, Menu, X, ChevronRight, LogOut,
  Heart, BookOpen, Package, Star, Play, MoreVertical, MessageCircle,
  ThumbsUp, ThumbsDown, Send, Share2, Settings, Maximize,
  CheckCircle, Lock, Bot, SquarePlay
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from "sonner";
import Logo from '../../assets/learnbridge-logo.png';
import Api from '../Services/Api';

const CourseVideos = () => {

  const { courseId } = useParams();

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


  const [lessons, setLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)


  // comments

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)

  const loadComments = () => {
    if (!activeLesson?.id) return;

    Api.get(`/courses/lessons/comments/${activeLesson.id}/`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Failed to load comments", err))
  }

  useEffect(() => {
    if (activeLesson) loadComments()
  }, [activeLesson])

  const postComment = async () => {
    if (!newComment.trim()) return

    try {
      await Api.post(`/courses/lessons/comments/${activeLesson.id}/`, {
        content: newComment
      })
      setNewComment("")
      loadComments()
      toast.success("Comment posted")
    } catch (error) {
      toast.error("Failed to post comment")
    }
  }

  const replyToComment = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      await Api.post(`/courses/comments/reply/${commentId}/`, {
        content: replyText
      })
      setReplyText("")
      setReplyingTo(null)
      loadComments()
      toast.success("Reply posted")
    } catch (error) {
      toast.error("Failed to post reply")
    }
  }

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const deleteComment = (id) => {
    setCommentToDelete(id);
    setShowDeleteModal(true);
  }

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      await Api.delete(`/courses/comments/${commentToDelete}/`)
      loadComments()
      toast.success("Comment deleted")
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete comment")
    }
  }


 

  const CommentItem = ({ comment, isReply = false }) => {



    const isReplying = replyingTo === comment.id;
    const isOwner = comment.user_name === username;
    const [showMenu, setShowMenu] = useState(false);

    // like state

    const [liked, setLiked] = useState(comment.is_liked_by_me);
    const [likes, setLikes] = useState(comment.likes_count);



    const toggleLike = async () => {
      const res = await Api.post(`/courses/comments/like/${comment.id}/`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    };

    return (
      <div className={`flex gap-4 ${isReply ? 'mt-4 pt-4 border-t border-gray-50' : ''}`}>
        <div className={`w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0`}>
          {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{comment.user_name}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* 3 Dots Menu */}
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-3 h-3 text-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-lg p-1 z-20 w-24 overflow-hidden">
                    {isOwner ? (
                      <button onClick={() => deleteComment(comment.id)} className="w-full text-left text-xs text-red-600 hover:bg-red-50 p-2 rounded flex items-center gap-2 transition-colors">
                        <LogOut className="w-3 h-3 rotate-180" /> Delete
                      </button>
                    ) : (
                      <div className="px-2 py-1 text-[10px] text-gray-400">Report</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500">

           <button
            onClick={toggleLike}
            className={`flex items-center gap-1 ${
              liked ? "text-blue-600" : ""
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${!liked ? "fill-blue-600" : ""}`} />
            {likes}
          </button>

            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(isReplying ? null : comment.id);
                  setReplyText("");
                }}
                className="flex items-center gap-1 hover:text-blue-600 font-medium transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 flex gap-2 animate-fade-in-down">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 transition-all"
                autoFocus
              />
              <button
                onClick={() => replyToComment(comment.id)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Send
              </button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };




  // Calculate total duration
  const calculateTotalDuration = (lessons) => {
    let totalSeconds = 0;
    lessons.forEach(lesson => {
      if (!lesson.duration) return;

      // format HH:MM:SS or MM:SS
      if (typeof lesson.duration === 'string' && lesson.duration.includes(':')) {
        const parts = lesson.duration.split(':').map(Number);
        if (parts.length === 3) {
          totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          totalSeconds += parts[0] * 60 + parts[1];
        }
      } else {

        totalSeconds += parseFloat(lesson.duration) || 0;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // playlist
  useEffect(() => {
    Api.get(`/student/courses/${courseId}/lessons/`)
      .then(res => {
        setLessons(res.data)
        setActiveLesson(res.data[0])

        if (res.data.length > 0) {
          setActiveLesson(res.data[0])
        }
      })
      .catch(() => toast.error("Failed to load lessons"));
  }, [courseId]);

  // Load video when lesson changes

  useEffect(() => {

    if (activeLesson) {
      Api.get(`/student/lessons/${activeLesson.id}/video/`)
        .then(res => setVideoUrl(res.data.signed_url))
        .catch(() => toast.error("Falied to load video"))
    }
  }, [activeLesson])



  const totalLessons = lessons.length


  const currentLessonIndex = lessons.findIndex(
    l => l.id === activeLesson?.id
  ) + 1

  const totalSeconds = lessons.reduce((acc, lesson) => {
    if (!lesson.duration) return acc;

    const parts = lesson.duration.split(":").map(Number)

    let seconds = 0

    if (parts.length === 2) {
      const [min, sec] = parts
      seconds = min * 60 + sec
    } else if (parts.length === 3) {
      const [hr, min, sec] = parts
      seconds = hr * 3600 + min * 60 + sec
    }

    return acc + seconds
  }, 0)


  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)




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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{activeLesson?.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{activeLesson?.title} • Lesson {currentLessonIndex} of {totalLessons}</p>
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

              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="text-white flex items-center justify-center h-full">
                  Loading video...
                </div>
              )}



            </div>

            {/* About This Lesson */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this lesson</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {activeLesson?.description}
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
                  {username?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-3 mb-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-gray-100">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent border-none focus:outline-none text-sm resize-none h-20 placeholder-gray-400"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={postComment}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <Send className="w-3 h-3" /> Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No comments yet. Be the first to start a discussion!
                  </div>
                )}
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
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
                <p className="text-xs text-gray-500">{lessons.length} lessons • {calculateTotalDuration(lessons)} total</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">

                {lessons.map((video) => (
                  <div
                    key={video.id}

                    onClick={() => {
                      setVideoUrl(null)
                      setActiveLesson(video)
                    }}
                    className={`p-3 flex gap-3 hover:bg-blue-50 transition-colors cursor-pointer border-l-2 ${activeLesson?.id === video.id ? 'bg-blue-50/50 border-blue-500' : 'border-transparent'}`}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-red-600 rotate-180" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Comment?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseVideos;