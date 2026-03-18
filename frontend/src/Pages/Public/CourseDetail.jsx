import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Clock,
  Star,
  Check,
  PlayCircle,
  FileText,
  Globe,
  AlertCircle,
  Heart,
  LogOut,
  BookOpen,
  Package,
  Ticket,
  CheckCircle,
} from "lucide-react";
import Logo from "../../assets/learnbridge-logo.png";
import Api from "../Services/Api";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "@/Store/authSlice";

const CourseDetail = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [relatedCourses, setRelatedCourses] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      Api.get("/student/wishlist").then((res) => {
        const ids = res.data.map((item) => item.course);
        setWishlistIds(ids);
      });
    }
  }, [isAuthenticated]);

  const handleWishlistToggle = async (e, courseId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to use wishlist");
      navigate("/student/login");
      return;
    }

    try {
      await Api.post("/student/wishlist/add/", {
        course_id: courseId,
      });

      setWishlistIds((prev) => [...prev, courseId]);
      toast.success("Added to wishlist ❤️");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.warning("Already in wishlist");
        setWishlistIds((prev) => [...prev, courseId]);
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const goToCourseDetail = (id) => {
    navigate(`/courseview/${id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setLoading(true);

    Api.get(`/courses/public/${id}/`)
      .then((res) => setCourse(res.data))

      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!course?.category_id) return;

    Api.get("/courses/public/", {
      params: { category: course.category_id },
    })
      .then((res) => {
        const data = res.data.results || res.data;
        const filtered = data.filter((c) => c.id !== course.id).slice(0, 4);

        setRelatedCourses(filtered);
      })
      .catch((err) => {
        console.error("Failed to load related courses", err);
      });
  }, [course]);

  const handleAddToCart = async (e, courseId) => {
    if (e) e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to add course to cart");
      navigate("/student/login");
      return;
    }

    try {
      await Api.post("/cart/add/", {
        course_id: courseId || id,
      });

      toast.success("Course added to cart 🛒");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.warning(err.response.data.detail || "Already in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">
                LearnBridge
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                to="/courses"
                className="hover:text-blue-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/question-community"
                className="hover:text-blue-600 transition-colors"
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
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative"
            >
              <Bell className="w-5 h-5" />
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
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              >
                {/* NOT LOGGED IN */}
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

                {/* LOGGED IN */}
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/profile")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
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
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
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
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full z-50">
            <a href="#" className="text-gray-700 font-medium">
              Explore
            </a>
            <a href="#" className="text-gray-700 font-medium">
              Q&A Community
            </a>
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

      {/* Course Header / Hero Section */}
      <div className="bg-[#0a192f] text-white pt-10 pb-16 md:py-16 relative">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
          {/* Left Content */}
          <div className="md:w-2/3 lg:w-3/4 pr-4">
            {/* <div className="flex gap-2 mb-4 text-xs font-semibold">
                            <span className="text-orange-400">Development</span>
                            <span className="text-gray-400">&gt;</span>
                            <span className="text-orange-400">Web Development</span>
                        </div> */}
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-4">
              {course.level}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-6 text-sm mb-6">
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                {course.average_rating
                  ? Number(course.average_rating).toFixed(1)
                  : "0.0"}

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(course.average_rating || 0)
                          ? "fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </span>
              <span className="text-blue-200">
                {" "}
                ({course.reviews_count || 0} reviews)
              </span>
              <span className="text-white">
                {course.students_count || 0} students
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-300">Created by</span>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 underline font-medium"
              >
                {course.instructor}
              </a>
              {/* <div className="flex items-center gap-1 text-gray-300 ml-4">
                                <AlertCircle className="w-4 h-4" /> Last updated 11/2024
                            </div> */}
              <div className="flex items-center gap-1 text-gray-300 ml-4">
                <Globe className="w-4 h-4" /> English
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Floating Sidebar Layout */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Scrollable Content (Left Side) */}
          <div className="md:w-2/3 lg:w-3/4 py-8">
            {/* What you'll learn */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Build 15+ real-world web applications",
                  "Master HTML, CSS, JavaScript fundamentals",
                  "Learn React, Node.js, and MongoDB",
                  "Deploy applications to production",
                  "Work with APIs and databases",
                  "Understand modern web development practices",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-gray-400">
                <li>No programming experience needed</li>
                <li>A computer with internet connection</li>
                <li>Willingness to learn and practice</li>
              </ul>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Related Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {relatedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      {/* ================= CLICKABLE AREA ================= */}
                      <div
                        onClick={() => goToCourseDetail(course.id)}
                        className="cursor-pointer"
                      >
                        <div className="relative h-60 overflow-hidden bg-gray-100">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <span
                            className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white 
                                                                ${
                                                                  course.level ===
                                                                  "Intermediate"
                                                                    ? "bg-orange-400"
                                                                    : course.level ===
                                                                        "Advanced"
                                                                      ? "bg-red-500"
                                                                      : "bg-orange-400"
                                                                }`}
                          >
                            {course.level}
                          </span>
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 mb-1 leading-tight line-clamp-2 text-lg">
                            {course.title}
                          </h3>
                          <p className="text-xs font-medium text-blue-600 mb-2">
                            {course.category}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            {course.instructor}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                            <span className="flex items-center gap-1 text-orange-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {course.average_rating
                                ? Number(course.average_rating).toFixed(1)
                                : "0.0"}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />{" "}
                              {course.students_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />{" "}
                              {course.total_duration || "0m"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto px-5 pb-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          {course.has_offer ? (
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-xl font-bold text-blue-600 tracking-tight">
                                ₹{Number(course.final_price || 0).toFixed(2)}
                              </span>
                              <span className="text-xs font-medium text-gray-500 line-through decoration-gray-400/60 decoration-1">
                                ₹{course.original_price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-blue-600 tracking-tight">
                              ₹{course.original_price}
                            </span>
                          )}
                        </div>

                        {isAuthenticated && course.is_purchased ? (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Purchased
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleAddToCart(e, course.id)}
                              className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>

                            <button
                              onClick={(e) =>
                                handleWishlistToggle(e, course.id)
                              }
                              className={`p-2 rounded-full transition
                                                                    ${
                                                                      wishlistIds.includes(
                                                                        course.id,
                                                                      )
                                                                        ? "bg-red-100 text-red-500"
                                                                        : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                                                                    }
                                                                `}
                            >
                              <Heart
                                className={`cursor-pointer w-4 h-4 ${
                                  wishlistIds.includes(course.id)
                                    ? "fill-red-500"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Floating Sidebar (Right Side) */}
          <div className="md:w-1/3 lg:w-1/4 md:-mt-32 lg:-mt-64 z-10">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative">
                {/* course.thumbnail */}
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <PlayCircle className="w-16 h-16 text-white opacity-80" />
                </div>
                {!(
                  isAuthenticated &&
                  (course?.is_enrolled === true || course?.is_purchased)
                ) && (
                  <button
                    onClick={(e) => handleWishlistToggle(e, course.id)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full transition shadow-md z-20
                                                    ${
                                                      wishlistIds.includes(
                                                        course.id,
                                                      )
                                                        ? "bg-white text-red-500"
                                                        : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
                                                    }`}
                  >
                    <Heart
                      className={`cursor-pointer w-5 h-5 ${wishlistIds.includes(course.id) ? "fill-red-500" : ""}`}
                    />
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Total Price
                  </p>
                  <div className="flex items-baseline gap-1">
                    {course.has_offer ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-5xl font-black text-gray-900 tracking-tight">
                          ₹{course.final_price}
                        </span>
                        <span className="text-xs font-medium text-gray-800 line-through decoration-black-400/60 decoration-1">
                          ₹{course.original_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-5xl font-black text-gray-900 tracking-tight">
                        ₹{course.original_price}
                      </span>
                    )}
                  </div>
                </div>

                {isAuthenticated && course?.is_enrolled === true ? (
                  <button
                    onClick={() => navigate("/mycourse")}
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-3 transition-colors shadow-sm"
                  >
                    Go to My Course
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-3 transition-colors shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </>
                )}

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Duration
                    </div>
                    <span>
                      {course.total_duration ? course.total_duration : "0h"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Lessons
                    </div>
                    <span>{course.total_lessons || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Language
                    </div>
                    <span>English</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
