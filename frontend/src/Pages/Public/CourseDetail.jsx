import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Bell, User, Menu, X, ChevronDown, Clock, Star, Check, PlayCircle, FileText, Globe, AlertCircle, Heart, LogOut, BookOpen, Package } from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';
import { useParams } from "react-router-dom";
import Api from "../Services/Api";

import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { logout } from '@/Store/authSlice';



const CourseDetail = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const { isAuthenticated, username } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [relatedCourses, setRelatedCourses] = useState([]);


    useEffect(()=>{

        setLoading(true)

        Api.get(`/courses/public/${id}/`)
        .then((res)=>setCourse(res.data))

        .finally(()=>setLoading(false))

    },[id])



    useEffect(() => {
        if (!course?.category_id) return;

        Api.get("/courses/public/", {
            params: { category: course.category_id }
        }).then(res =>
            setRelatedCourses(res.data.filter(c => c.id !== course.id))
        );
        }, [course]);


    const handleAddToCart = async()=>{

        if(!isAuthenticated){
            toast.info("Please login to add course to cart");
            navigate("/student/login")
            return
        }

        try{

            await Api.post("/cart/add/",{
                course_id:id,
            })

            toast.success("Course added to cart 🛒")
        }catch(err){
            if(err.response?.status===400){
                toast.warning(err.response.data.detail || "Already in cart" )
            }else{
                toast.error("Failed to add to cart")
            }
        }
    }


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
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <img src={Logo} alt="LearnBridge Logo" className="h-8" />
                            <span className="text-xl font-bold text-gray-900">LearnBridge</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">Explore</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Q&A Community</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={()=>navigate("/cart")} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <ShoppingCart className="w-5 h-5 cursor-pointer" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Bell className="w-5 h-5" />
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
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

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
                                    onClick={() => navigate("/student/courses")}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                                    >
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

                        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
                        <a href="#" className="text-gray-700 font-medium">Explore</a>
                        <a href="#" className="text-gray-700 font-medium">Q&A Community</a>
                        <a href="#" className="text-gray-700 font-medium">Live Classes</a>
                        <hr className="border-gray-100" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                A
                            </div>
                            <span className="text-sm font-medium">Aghosh</span>
                        </div>
                    </div>
                )}
            </nav>

            {/* Course Header / Hero Section */}
            <div className="bg-[#0a192f] text-white pt-10 pb-16 md:py-16 relative">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
                    {/* Left Content */}
                    <div className="md:w-2/3 lg:w-3/4 pr-4">
                        <div className="flex gap-2 mb-4 text-xs font-semibold">
                            <span className="text-orange-400">Development</span>
                            <span className="text-gray-400">&gt;</span>
                            <span className="text-orange-400">Web Development</span>
                        </div>
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
                                4.8 <div className="flex"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
                            </span>
                            <span className="text-blue-200">(145,230 reviews)</span>
                            <span className="text-white">892,450 students</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-300">Created by</span>
                            <a href="#" className="text-blue-400 hover:text-blue-300 underline font-medium">{course.instructor}</a>
                            <div className="flex items-center gap-1 text-gray-300 ml-4">
                                <AlertCircle className="w-4 h-4" /> Last updated 11/2024
                            </div>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Build 15+ real-world web applications',
                                    'Master HTML, CSS, JavaScript fundamentals',
                                    'Learn React, Node.js, and MongoDB',
                                    'Deploy applications to production',
                                    'Work with APIs and databases',
                                    'Understand modern web development practices'
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-gray-400">
                                <li>No programming experience needed</li>
                                <li>A computer with internet connection</li>
                                <li>Willingness to learn and practice</li>
                            </ul>
                        </div>

                        {/* Related Courses */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Courses</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedCourses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                                        <div className="relative h-40 overflow-hidden">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white ${course.level === 'Intermediate' ? 'bg-orange-400' : course.level === 'Advanced' ? 'bg-orange-500' : 'bg-orange-400'}`}>
                                                {course.level}
                                            </span>
                                            <button className="absolute top-3 left-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1 leading-tight line-clamp-2 text-sm md:text-base">{course.title}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{course.instructor}</p>

                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 font-medium">
                                                <span className="flex items-center gap-1 text-orange-500">
                                                    <Star className="w-3 h-3 fill-current" /> {course.rating}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {course.reviews}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {course.duration}
                                                </span>
                                            </div>

                                            <div className="mt-auto pt-3 border-t border-gray-50">
                                                <span className="text-lg font-bold text-blue-600">{course.price}</span>
                                                
                                            </div>

                                            {/* <button className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button> */}
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Floating Sidebar (Right Side) */}
                    <div className="md:w-1/3 lg:w-1/4 md:-mt-32 lg:-mt-64 z-10">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="relative">
                                {/* course.thumbnail */}
                                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600" alt="Course Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-gray-900 mb-6">₹{course.price}/-</div>

                                <button onClick={handleAddToCart} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-3 transition-colors shadow-sm">
                                    Add to Cart
                                </button>
                                <button className="w-full cursor-pointer bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg mb-6 transition-colors">
                                    Buy Now
                                </button>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</div>
                                        <span>42 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Lessons</div>
                                        <span>{course.total_lessons}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Language</div>
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
