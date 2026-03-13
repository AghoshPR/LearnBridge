import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Code,
  Database,
  PenTool,
  Layout,
  TrendingUp,
  Camera,
  ThumbsUp,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Heart,
  BookOpen,
  Package,
  Plus,
  Eye,
  Ticket,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import Logo from "../../assets/learnbridge-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Api from "../Services/Api";

const QuestionCommunity = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Recent");

  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated]);

  const fetchQuestions = async (page = 1) => {
    try {
      const res = await Api.get("/qna/questions/", {
        params: {
          search: searchQuery || undefined,
          page: page,
        },
      });

      if (res.data.results) {
        setQuestions(res.data.results);
        setPaginationInfo({
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
        });
        setTotalPages(Math.ceil(res.data.count / 10));
      } else {
        setQuestions(res.data);
      }
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchQuestions(1);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchQuestions(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchTags = async () => {
    try {
      const res = await Api.get("/qna/public-tags/");
      setAvailableTags(res.data);
    } catch (err) {
      toast.err("failed to load tags");
    }
  };

  const fetchCourses = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await Api.get("/student/mycourses/");
      setCourses(res.data.results || res.data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const handleLike = async (questionId, e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Login required");
      navigate("/student/login");
      return;
    }

    try {
      await Api.post(`/qna/questions/${questionId}/like/`);
      fetchQuestions(currentPage);
    } catch (err) {
      toast.error("Error liking question");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePostQuestion = async () => {
    if (!isAuthenticated) {
      toast.error("Login required");
      navigate("/student/login");
      return;
    }

    if (!newQuestionTitle.trim()) {
      toast.error("Question title is required");
      return;
    }

    try {
      const tagIds = tags
        .map((tagName) => {
          const found = availableTags.find((t) => t.tag_name === tagName);
          return found ? found.id : null;
        })
        .filter(Boolean);

      const payload = {
        title: newQuestionTitle,
        body: newQuestionTitle,
        tag_ids: tagIds,
      };

      if (selectedCourse) {
        payload.course = selectedCourse;
      }

      if (editQuestionId) {
        await Api.patch(
          `/qna/questions/editquestion/${editQuestionId}/`,
          payload,
        );
        toast.success("Question updated successfully!");
      } else {
        await Api.post("/qna/questions/create/", payload);
        toast.success("Question posted successfully!");
      }

      closeModal();
      fetchQuestions(currentPage);
    } catch (err) {
      toast.error(`Error ${editQuestionId ? "updating" : "posting"} question`);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditQuestionId(null);
    setNewQuestionTitle("");
    setSelectedCourse("");
    setTags([]);
  };

  const handleEditClick = (question) => {
    setEditQuestionId(question.id);
    setNewQuestionTitle(question.title);
    setSelectedCourse(question.course || "");
    setTags(question.tags ? question.tags.map((t) => t.tag_name) : []);
    setModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteQuestion = async () => {
    if (deleteQuestionId === null) return;

    try {
      await Api.delete(`/qna/questions/deletequestion/${deleteQuestionId}/`);
      toast.success("Question deleted successfully!");
      fetchQuestions(currentPage);
      setDeleteModalOpen(false);
      setDeleteQuestionId(null);
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">
                LearnBridge
              </span>
            </a>
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
              onClick={() => navigate("/student/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {/* <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative cursor-pointer"
            >
              <Heart className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer">
                <span className="text-sm font-medium cursor-pointer">
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
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/student/register")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
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
                      onClick={() => navigate("/student/wishlist")}
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
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-700 font-medium text-left"
            >
              Explore
            </button>
            <Link
              to="/question-community"
              className="text-gray-700 font-medium text-left"
            >
              Q&A Community
            </Link>
            <Link
              to="/student/liveclass"
              className="text-gray-700 font-medium text-left"
            >
              Live Classes
            </Link>
            <hr className="border-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">
                {isAuthenticated ? username : "Guest"}
              </span>
            </div>

            {isAuthenticated && (
              <div className="flex flex-col gap-3 mt-2">
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
                  onClick={() => navigate("/student/wishlist")}
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
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Q&A Community
            </h1>
            <p className="text-gray-500">
              Get help from our community of learners and experts
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm cursor-pointer"
          >
            <Plus size={18} />
            Ask Question
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Popular Tags */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  if (!tags.includes(tag.tag_name) && tags.length < 5) {
                    setTags([...tags, tag.tag_name]);
                  }
                }}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-600 transition-colors"
              >
                {tag.tag_name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          {["Recent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
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
            <div
              key={question.id}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-6"
              onClick={() => navigate(`/question-community/${question.id}`)}
            >
              {/* Stats */}
              <div className="hidden sm:flex flex-col gap-2 min-w-[3rem] text-gray-400">
                <div
                  onClick={(e) => handleLike(question.id, e)}
                  className="flex items-center gap-1.5"
                  title="Like"
                >
                  <ThumbsUp
                    size={16}
                    className={question.likes_count > 0 ? "text-blue-500" : ""}
                  />
                  <span
                    className={`text-sm font-semibold ${question.likes_count > 0 ? "text-gray-700" : ""}`}
                  >
                    {question.likes_count || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Answers">
                  <MessageSquare size={16} />
                  <span className="text-sm font-semibold">
                    {question.answers_count}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Views">
                  <Eye size={16} />
                  <span className="text-sm font-semibold">
                    {" "}
                    {question.views_count || 0}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors leading-tight">
                  {question.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200"
                    >
                      {tag?.tag_name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 ${question.authorColor} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {question.user_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <User size={14} />
                    <span className="text-gray-700">{question.user_name}</span>
                    <span>•</span>
                    <span>{formatDateTime(question.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Action Menu (3 Dots) */}
              {isAuthenticated && username === question.user_name && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === question.id ? null : question.id,
                      );
                    }}
                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors flex shrink-0"
                    title="More Options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {activeDropdown === question.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-10 animate-in fade-in zoom-in duration-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(question);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteQuestionId(question.id);
                          setDeleteModalOpen(true);
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

              {/* Mobile Stats (only visible on extra small screens if needed, otherwise hidden) */}
              <div className="sm:hidden flex flex-col gap-3 min-w-[3rem] items-end text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} /> {question.likes_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} /> {question.answers_count}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {paginationInfo.count > 10 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8">
            <div className="text-sm text-gray-500 font-medium">
              Showing{" "}
              <span className="text-gray-900">
                {(currentPage - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="text-gray-900">
                {Math.min(currentPage * 10, paginationInfo.count)}
              </span>{" "}
              of <span className="text-gray-900">{paginationInfo.count}</span>{" "}
              questions
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginationInfo.previous}
                className={`flex items-center justify-center p-2 rounded-lg border border-gray-200 transition-all ${
                  !paginationInfo.previous
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                }`}
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationInfo.next}
                className={`flex items-center justify-center p-2 rounded-lg border border-gray-200 transition-all ${
                  !paginationInfo.next
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {questions.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {searchQuery
                ? `We couldn't find any questions matching "${searchQuery}"`
                : "Be the first one to ask a question in this community!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Ask Question Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editQuestionId ? "Edit Question" : "Ask a Question"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Question Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Question Title
                </label>
                <textarea
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="e.g. why python uses cpython?"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none text-gray-800"
                />
              </div>

              {/* Select Course */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Course
                </label>
                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-800 cursor-pointer"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option
                        key={course.course_id || course.id}
                        value={course.course_id || course.id}
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="rotate-90 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Tags (max 5)
                </label>

                {/* Selected Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full text-sm flex items-center gap-1 border border-blue-200"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Available Admin Tags */}
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        if (!tags.includes(tag.tag_name) && tags.length < 5) {
                          setTags([...tags, tag.tag_name]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                          ${
                            tags.includes(tag.tag_name)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          }`}
                    >
                      {tag.tag_name}
                    </button>
                  ))}
                </div>

                {tags.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Please select at least one tag
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostQuestion}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  {editQuestionId ? "Save Changes" : "Post Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteQuestionId(null);
                }}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
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

export default QuestionCommunity;
