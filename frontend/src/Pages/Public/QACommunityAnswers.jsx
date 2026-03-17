import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Share2,
  MoreVertical,
  Send,
  User,
  Menu,
  X,
  ShoppingCart,
  Bell,
  LogOut,
  BookOpen,
  Heart,
  Package,
  Ticket,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Store/authSlice";
import Logo from "../../assets/learnbridge-logo.png";
import { toast } from "sonner";
import Api from "../Services/Api";

const QACommunityAnswers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchQuestionDetail();
    fetchAnswers();
  }, [id]);

  const fetchQuestionDetail = async () => {
    try {
      const res = await Api.get(`/qna/questions/${id}/`);
      console.log("DETAIL DATA:", res.data);
      setQuestion(res.data);
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  const fetchAnswers = async () => {
    try {
      const res = await Api.get(`/qna/questions/answers/${id}/`);
      setAnswers(res.data);
    } catch (err) {
      toast.error("failed to load answers");
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString(); // shows date + time
  };

  const handlePostAnswer = async () => {
    if (!isAuthenticated) {
      toast.error("Login required");
      navigate("/student/login");
      return;
    }

    if (!newAnswer.trim()) return;

    try {
      if (editingAnswerId) {
        await Api.patch(`/qna/answers/${editingAnswerId}/modify/`, {
          body: newAnswer,
        });
        toast.success("Answer updated successfully");
        setEditingAnswerId(null);
      } else {
        await Api.post(`/qna/questions/answers/create/${id}/`, {
          body: newAnswer,
        });
        toast.success("Answer posted successfully");
      }
      setNewAnswer("");
      fetchAnswers();
    } catch (err) {
      toast.error(`Failed to ${editingAnswerId ? "update" : "post"} answer`);
    }
  };

  const handlePostReply = async (answerId) => {
    if (!replyText.trim()) return;

    try {
      if (editingReplyId) {
        await Api.patch(`/qna/replies/${editingReplyId}/modify/`, {
          body: replyText,
        });
        toast.success("Reply updated successfully!");
        setEditingReplyId(null);
      } else {
        await Api.post(`/qna/answers/reply/${answerId}/`, {
          body: replyText,
        });
        toast.success("Reply posted successfully!");
      }

      setReplyText("");
      setReplyingTo(null);
      fetchAnswers();
    } catch (err) {
      toast.error(`Failed to ${editingReplyId ? "update" : "post"} reply`);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await Api.delete(`/qna/answers/${answerId}/modify/`);
      toast.success("Answer deleted successfully!");
      fetchAnswers();
    } catch (err) {
      toast.error("Failed to delete answer");
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      await Api.delete(`/qna/replies/${replyId}/modify/`);
      toast.success("Reply deleted successfully!");
      fetchAnswers();
    } catch (err) {
      toast.error("Failed to delete reply");
    }
  };

  const handleLikeQuestion = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Login required");
      navigate("/student/login");
      return;
    }

    try {
      await Api.post(`/qna/questions/${id}/like/`);
      fetchQuestionDetail();
    } catch (err) {
      toast.error("Failed to like question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar (Reused from QuestionCommunity) */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">
                LearnBridge
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                to="/courses"
                className="hover:text-blue-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/question-community"
                className="text-blue-600 font-semibold transition-colors"
              >
                Q&A Community
              </Link>
              <Link
                to="/student/liveclass"
                className="hover:text-blue-600 transition-colors"
              >
                Live Classes
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ShoppingCart className="w-5 h-5  cursor-pointer" />
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative"
            >
              <Bell className="w-5 h-5" />
              {/* Mock notification badge */}
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <Heart className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">
                  {isAuthenticated ? `Hi, ${username}` : "User"}
                </span>
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
                      <User className="w-4 h-4" /> Login
                    </button>
                    <button
                      onClick={() => navigate("/student/register")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" /> Sign Up
                    </button>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/profile")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                      onClick={() => navigate("/mycourse")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" /> My Courses
                    </button>
                    <button
                      onClick={() => navigate("/wishlist")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </button>
                    <button
                      onClick={() => navigate("/student/coupons")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Package className="w-4 h-4" /> Coupons
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
                      <LogOut className="w-4 h-4 cursor-pointer" /> Logout
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
            <Link to="/courses" className="text-gray-700 font-medium">
              Explore
            </Link>
            <Link
              to="/question-community"
              className="text-gray-700 font-medium"
            >
              Q&A Community
            </Link>
            <Link to="/student/liveclass" className="text-gray-700 font-medium">
              Live Classes
            </Link>
            <hr className="border-gray-100" />

            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/student/login")}
                  className="w-full px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/student/register")}
                  className="w-full px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium">
                    {username || "User"}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/student/profile")}
                  className="text-gray-700 font-medium text-left"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/mycourse")}
                  className="text-gray-700 font-medium text-left"
                >
                  My Courses
                </button>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="text-gray-700 font-medium text-left"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => navigate("/student/coupons")}
                  className="text-gray-700 font-medium text-left"
                >
                  Coupons
                </button>
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
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        {/* Back Link */}
        <Link
          to="/question-community"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Community
        </Link>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Stats Column */}
            <div className="flex flex-row sm:flex-col items-center justify-start gap-6 sm:gap-4 text-gray-400 sm:min-w-[3rem] border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-4">
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <ThumbsUp
                  onClick={handleLikeQuestion}
                  size={20}
                  className="hover:text-blue-500 cursor-pointer transition-colors"
                />
                <span className="text-sm font-bold text-gray-700">
                  {question?.likes_count || 0}
                </span>
                <span className="text-[10px] uppercase hidden sm:block">
                  votes
                </span>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <MessageSquare size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">
                  {question?.answers_count || 0}
                </span>
                <span className="text-[10px] uppercase hidden sm:block">
                  answers
                </span>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <Eye size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">
                  {question?.views_count || 0}
                </span>
                <span className="text-[10px] uppercase hidden sm:block">
                  views
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {question?.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {question?.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full"
                  >
                    {tag.tag_name}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200">
                  Course : {question?.course_name}
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {question?.user_name?.charAt(0)}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-blue-600">
                    {question?.user_name}
                  </span>
                  <span className="text-gray-500 ml-1">
                    asked {formatDateTime(question?.created_at)}
                    
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Answer Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingAnswerId ? "Edit Your Answer" : "Your Answer"}
          </h2>
          <div className="mb-4">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here... Be detailed and helpful."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-y bg-gray-50"
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePostAnswer}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Send size={18} />
              {editingAnswerId ? "Update Answer" : "Post Answer"}
            </button>
            {editingAnswerId && (
              <button
                onClick={() => {
                  setEditingAnswerId(null);
                  setNewAnswer("");
                }}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Answers List */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {answers.length} Answers
          </h2>

          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 order-2 sm:order-1">
                    <p className="text-gray-800 mb-4 text-base leading-relaxed">
                      {answer?.body}
                    </p>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {answer?.user_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">
                            {answer?.user_name}
                          </span>
                          <span className="ml-1">answered {answer.time}</span>
                          <span>{formatDateTime(answer?.created_at)}</span>
                        </div>
                      </div>

                      {/* Action Menu (3 Dots) for Answer */}
                      {isAuthenticated && username === answer.user_name && (
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(
                                activeDropdown === `answer-${answer.id}`
                                  ? null
                                  : `answer-${answer.id}`,
                              );
                            }}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors flex shrink-0"
                            title="More Options"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeDropdown === `answer-${answer.id}` && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-10 animate-in fade-in zoom-in duration-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAnswerId(answer.id);
                                  setNewAnswer(answer.body);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAnswer(answer.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reply Button */}
                    <button
                      onClick={() => {
                        setReplyingTo(
                          replyingTo === answer.id && !editingReplyId
                            ? null
                            : answer.id,
                        );
                        setEditingReplyId(null);
                        setReplyText("");
                      }}
                      className="text-blue-600 text-sm font-medium hover:underline mb-4 inline-block"
                    >
                      Reply
                    </button>

                    {/* Reply Form */}
                    {replyingTo === answer.id && (
                      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-3 bg-white"
                          rows="3"
                        ></textarea>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePostReply(answer.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            {editingReplyId ? "Update Reply" : "Submit Reply"}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setEditingReplyId(null);
                              setReplyText("");
                            }}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies List */}
                    {answer.replies.length > 0 && (
                      <div className="pl-6 border-l-2 border-gray-100 space-y-4 mt-2">
                        {answer.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 p-3 rounded-lg relative group pr-10"
                          >
                            <div className="flex items-start justify-between mb-2">
                              {/* Reply Author Info */}
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
                                  {reply.user_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || (
                                    <User className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  <span className="font-semibold text-gray-700">
                                    {reply.user_name}
                                  </span>
                                  <span className="ml-1">
                                    replied {formatDateTime(reply.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Reply Body */}
                            <p className="text-sm text-gray-800">
                              {reply.body}
                            </p>

                            {/* Action Menu (3 Dots) for Reply */}
                            {isAuthenticated &&
                              username === reply.user_name && (
                                <div
                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDropdown(
                                        activeDropdown === `reply-${reply.id}`
                                          ? null
                                          : `reply-${reply.id}`,
                                      );
                                    }}
                                    className="p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full transition-colors flex shrink-0"
                                    title="More Options"
                                  >
                                    <MoreVertical size={16} />
                                  </button>

                                  {activeDropdown === `reply-${reply.id}` && (
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-10 animate-in fade-in zoom-in duration-100">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReplyingTo(answer.id);
                                          setEditingReplyId(reply.id);
                                          setReplyText(reply.body);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                      >
                                        <Edit size={14} /> Edit
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteReply(reply.id);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                      >
                                        <Trash2 size={14} /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Helpful Actions */}
                  {/* <div className="flex flex-row sm:flex-col items-center gap-4 sm:min-w-[3rem] order-1 sm:order-2 mb-2 sm:mb-0 border-b sm:border-b-0 sm:border-l border-gray-100 pb-2 sm:pb-0 sm:pl-4">
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1 group cursor-pointer">
                      <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span className="text-xs text-gray-500">helpful</span>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1 group cursor-pointer">
                      <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-xs text-gray-500 text-center leading-tight">Not helpful</span>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QACommunityAnswers;
