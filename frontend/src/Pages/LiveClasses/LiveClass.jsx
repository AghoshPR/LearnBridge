import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Bell, User, BookOpen, Heart, LogOut, Package, Menu, X, Video, Users, Clock, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import Api from '../Services/Api';

const LiveClass = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [liveNowClasses, setLiveNowClasses] = useState([]);

  const [isPaying, setIsPaying] = useState(false);






  useEffect(() => {
    fetchUpcomingClasses()
  }, [])

  const fetchUpcomingClasses = async () => {

    try {
      const res = await Api.get("/student/liveclass/upcoming/")
      const now = new Date()

      const upcoming = res.data.filter(
        cls => new Date(cls.start_time) > now
      )

      const liveNow = res.data.filter(cls => cls.is_registered === true)

      setUpcomingClasses(upcoming)
      setLiveNowClasses(liveNow)

    } catch {
      toast.error("Failed to load live classes")
    }
  }

  const payForLiveClass = async () => {
        if (isPaying) return;

        try {
            setIsPaying(true);

            const res = await Api.post(
            "/student/liveclass/razorpay/create/",
            { class_id: selectedClass.class_id }
            );

            const data = res.data;

            const options = {
            key: data.key,
            amount: data.amount,
            currency: "INR",
            name: "LearnBridge",
            description: selectedClass.title,
            order_id: data.razorpay_order_id,

            handler: async function (response) {
                try {
                await Api.post(
                    "/student/liveclass/razorpay/verify/",
                    {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    class_id: data.class_id,
                    }
                );

                toast.success("Registration Successful ✅");

                
                setIsRegisterModalOpen(false);
                setSelectedClass(null);

                
                await fetchUpcomingClasses();

                } catch (err) {
                toast.error("Verification failed");
                } finally {
                setIsPaying(false);
                }
            },

            modal: {
                ondismiss: function () {
                setIsPaying(false);
                }
            },

            prefill: {
                name: username
            },

            theme: {
                color: "#2563eb"
            }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            toast.error("Payment failed");
            setIsPaying(false);
        }
        };

    const handleJoinLive = async (cls) => {
        try {
            const res = await Api.get(
                `/student/liveclass/room/${cls.class_id}/`
            );

            if (res.data.allowed) {
                navigate(`/liveclass/room/${cls.class_id}`);
            }

        } catch (error) {
            toast.error("You are not registered");
        }
    };

  const handleRegisterClick = (cls) => {

    if (!isAuthenticated) {
        toast.error("Please login to register");
        navigate("/student/login");
        return;
    }

    setSelectedClass(cls);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar from Home.jsx */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="hover:text-blue-600 transition-colors">Q&A Community</Link>
              <Link to="/student/liveclass" className="text-blue-600 transition-colors">Live Classes</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
            </button>
            <button onClick={() => navigate('/student/notifications')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative">
              <Bell className="w-5 h-5" />
              {/* Mock notification badge */}
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={() => navigate('/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Heart className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">{isAuthenticated ? `Hi, ${username}` : "User"}</span>
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {isAuthenticated && username ? username.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                {!isAuthenticated && (
                  <>
                    <button onClick={() => navigate("/student/login")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <User className='w-4 h-4' /> Login
                    </button>
                    <button onClick={() => navigate("/student/register")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" /> Sign Up
                    </button>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button onClick={() => navigate("/mycourse")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" /> My Courses
                    </button>
                    <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" /> Wishlist
                    </button>
                    <button onClick={() => navigate("/student/coupons")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Package className="w-4 h-4" /> Coupons
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => {
                      dispatch(logout());
                      navigate("/student/login", { replace: true });
                      toast.success("Logged out successfully 👋", {
                        description: "See you again!",
                        duration: 2500,
                      });
                    }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer">
                      <LogOut className="w-4 h-4 cursor-pointer" /> Logout
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
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <Link to="/courses" className="text-gray-700 font-medium">Explore</Link>
            <Link to="/question-community" className="text-gray-700 font-medium">Q&A Community</Link>
            <Link to="/student/liveclass" className="text-blue-600 font-medium">Live Classes</Link>
            <hr className="border-gray-100" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated && username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">{isAuthenticated && username ? username : "User"}</span>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Classes</h1>
          <p className="text-gray-600">Join interactive live sessions with expert instructors</p>
        </div>



        <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'live' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Live Now <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shrink-0">
  {liveNowClasses.length}
</span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${activeTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Past Sessions
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.map(cls => (
              <div key={cls.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={cls.thumbnail ? (cls.thumbnail.startsWith("http") ? cls.thumbnail : `http://localhost:8000${cls.thumbnail}`) : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"}
                  alt={cls.title}
                  className="w-full h-48 object-cover"
                />


                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                      {cls.subject || 'General'}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Users className="w-3 h-3 mr-1" /> {cls.registered_count}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{cls.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">by {cls.teacher_name}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" /> {new Date(cls.start_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" /> {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  
                    {cls.is_registered ? (
                        <button
                            disabled
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                            Registered ✓
                        </button>
                        ) : (
                        <button
                            onClick={() => handleRegisterClick(cls)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                        >
                            Register
                        </button>
                        )}


                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveNowClasses.map(cls => (
              <div key={cls.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={cls.thumbnail ? (cls.thumbnail.startsWith("http") ? cls.thumbnail : `http://localhost:8000${cls.thumbnail}`) : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"}
                    alt={cls.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                      {cls.subject || 'General'}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Users className="w-3 h-3 mr-1" /> {cls.registered_count}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{cls.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">by {cls.teacher_name}</p>

                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <Clock className="w-4 h-4 mr-2" /> {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                    {/* handle join             */}

                    {cls.is_registered ? (
                        <button
                            onClick={() => handleJoinLive(cls)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                        >
                            Join Now
                        </button>
                        ) : (
                        <button
                            disabled
                            className="w-full bg-gray-400 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                            Not Registered
                        </button>
                        )}


                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="text-center py-12 text-gray-500">
            No past sessions available.
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Register for Live Class</h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="space-y-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" placeholder="Enter your name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="Enter your email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input type="text" value={selectedClass?.title || ''} readOnly className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-2" />
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mt-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Information</h3>

                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Registration Fee:</span>
                    <span className="text-lg font-bold text-blue-600">₹ {selectedClass?.registration_fee}</span>
                  </div>

                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-medium text-gray-900 text-sm">UPI Payment</span>
                      </div>
                      {paymentMethod === 'upi' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">Demo payment - all fields optional</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 font-medium transition-colors"
                onClick={payForLiveClass}
                disabled={isPaying}
              >
                {isPaying ? "Processing..." : "Complete Registration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClass;