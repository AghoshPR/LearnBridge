import React, { useEffect, useState } from 'react';
import { Package, Calendar, User, Eye, Search, ShoppingCart, Bell, BookOpen, Heart, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { toast } from "sonner";
import Logo from '../../assets/learnbridge-logo.png';
import Api from '../Services/Api';

const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const [purchasedCourses, setPurchasedCourses] = useState([])

  useEffect(() => {
    Api.get("/student/mycourses/")
      .then(res => setPurchasedCourses(res.data))
  }, [])



  return (
    <div className="min-h-screen bg-background font-sans text-gray-800">
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

              <Link to="/question-community" className="hover:text-blue-600 transition-colors">Q&A Community</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ShoppingCart className="w-5 h-5  cursor-pointer" />
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


                {/* Not Logged In */}

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


                {/*  LOGGED IN */}


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

                    <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
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
                {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">{isAuthenticated ? `Hi, ${username}` : "User"}</span>
            </div>
          </div>
        )}
      </nav>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Courses</h1>
            <p className="text-muted-foreground mt-1 text-sm">View and learn your courses</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full bg-card border border-border pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {purchasedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Clickable Area */}
                <div
                  onClick={() => navigate(`/course/videos/${course.course_id}`)}
                  className="cursor-pointer flex-1"
                >
                  {/* Image - Taller height (h-60) for "half of card" look */}
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm
                        ${course.status === 'Completed' ? 'bg-green-500' :
                          course.status === 'In Progress' ? 'bg-blue-500' :
                            'bg-yellow-500'}`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1 leading-tight line-clamp-2 text-lg">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <User className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Purchased: {new Date(course.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto px-5 pb-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    ₹{course.price}
                  </span>


                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">No courses found</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              You haven't purchased any courses yet. Explore our catalog to start learning!
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;