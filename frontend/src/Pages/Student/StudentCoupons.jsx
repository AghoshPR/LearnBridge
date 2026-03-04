import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { toast } from "sonner";
import {
  User,
  BookOpen,
  LogOut,
  ShoppingCart,
  Bell,
  Heart,
  Package,
  Menu,
  X,
  Ticket
} from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';
import Api from '../Services/Api';

const StudentCoupons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [coupons, setCoupons] = useState([])

  useEffect(() => {

    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {

    try {
      const res = await Api.get("/mycoupons/")
      setCoupons(res.data)
    } catch {
      toast.error("Failed to load coupon")
    }
  }


  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Q&A Community</a>
              <Link to="/student/liveclass" className="hover:text-blue-600 transition-colors">Live Classes</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/student/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
            <button onClick={() => navigate('/student/notifications')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative">
              <Bell className="w-5 h-5" />
              {/* <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            <button onClick={() => navigate('/student/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative">
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
                      <User className="w-4 h-4 cursor-pointer" />
                      Profile
                    </button>

                    <button onClick={() => navigate("/mycourse")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>

                    <button onClick={() => navigate("/student/wishlist")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>

                    <button onClick={() => navigate("/student/coupons")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
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


            <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <button onClick={() => navigate("/courses")} className="text-gray-700 font-medium">Explore</button>
            <a href="#" className="text-gray-700 font-medium">Q&A Community</a>
            <Link to="/student/liveclass" className="text-gray-700 font-medium">Live Classes</Link>
            <hr className="border-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">{isAuthenticated ? username : "Guest"}</span>
            </div>

            {isAuthenticated && (
              <div className="flex flex-col gap-3 mt-2">
                <button onClick={() => navigate("/student/profile")} className="text-gray-700 font-medium text-left">Profile</button>
                <button onClick={() => navigate("/mycourse")} className="text-gray-700 font-medium text-left">My Courses</button>
                <button onClick={() => navigate("/student/wishlist")} className="text-gray-700 font-medium text-left">Wishlist</button>
                <button onClick={() => navigate("/student/coupons")} className="text-gray-700 font-medium text-left">Coupons</button>
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
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Coupons</h1>
        <p className="text-gray-500 mb-8">View your available coupons and usage details</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-700">Coupon Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Coupon ends</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{coupon.code}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{coupon.valid_till}</td>
                    <td className="px-6 py-4 text-gray-600">{coupon.max_uses_per_user}</td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentCoupons