import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Bell, User, Code, Database, PenTool, Layout, TrendingUp, Camera, ThumbsUp, MessageSquare, Menu, X, ChevronRight, LogOut, Heart, BookOpen, Package, Clock, CheckCircle } from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import Api from '../Services/Api';




const Home = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isAuthenticated, username } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()




    const [categories, setCategories] = useState([]);
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [popularTags, setPopularTags] = useState([]);

    useEffect(() => {
        Api.get("/courses/categories/public/")
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err));

        Api.get("/courses/public/")
            .then((res) => setTrendingCourses(res.data.results ? res.data.results.slice(0, 4) : res.data.slice(0, 4)))
            .catch((err) => console.log(err));

        Api.get("/qna/questions/")
            .then((res) => {
                const data = res.data.results || res.data;
                setQuestions(Array.isArray(data) ? data.slice(0, 3) : []);
            })
            .catch((err) => console.log(err));

        Api.get("/qna/public-tags/")
            .then((res) => {
                const data = res.data.results || res.data;
                setPopularTags(Array.isArray(data) ? data.slice(0, 4) : []);
            })
            .catch((err) => console.log(err));
    }, []);

    const ICONS = [
        { icon: Code, color: 'bg-blue-500' },
        { icon: Database, color: 'bg-orange-500' },
        { icon: PenTool, color: 'bg-purple-500' },
        { icon: Layout, color: 'bg-green-500' },
        { icon: TrendingUp, color: 'bg-red-500' },
        { icon: Camera, color: 'bg-pink-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <a href="/" className="flex items-center gap-2 cursor-pointer">
                            <img src={Logo} alt="LearnBridge Logo" className="h-8" />
                            <span className="text-xl font-bold text-gray-900">LearnBridge</span>
                        </a>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">

                            <Link to='/courses' className="hover:text-blue-600 transition-colors cursor-pointer">Explore</Link>

                            <Link to="/question-community" className="hover:text-blue-600 transition-colors cursor-pointer">Q&A Community</Link>
                            <Link to="/student/liveclass" className="hover:text-blue-600 transition-colors cursor-pointer">Live Classes</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 cursor-pointer">
                            <ShoppingCart className="w-5 h-5  cursor-pointer" />
                        </button>
                        <button onClick={() => navigate('/student/notifications')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative cursor-pointer">
                            <Bell className="w-5 h-5" />
                            {/* Mock notification badge */}
                            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button onClick={() => navigate('/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 cursor-pointer">
                            <Heart className="w-5 h-5" />
                        </button>


                        <div className="relative group">
                            <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer">
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
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
                                        >
                                            <User className='w-4 h-4' />
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


                                {/*  LOGGED IN */}


                                {isAuthenticated && (
                                    <>
                                        <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>

                                        <button onClick={() => navigate("/mycourse")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                                            <BookOpen className="w-4 h-4" />
                                            My Courses
                                        </button>

                                        <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                                            <Heart className="w-4 h-4" />
                                            Wishlist
                                        </button>

                                        <button onClick={() => navigate("/student/coupons")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                                            <Package className="w-4 h-4" />
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


                        <button className="md:hidden p-2 text-gray-600 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
                        <button onClick={() => navigate("/courses")} className="text-gray-700 font-medium text-left cursor-pointer">Explore</button>
                        <Link to="/question-community" className="text-gray-700 font-medium cursor-pointer">Q&A Community</Link>
                        <Link to="/student/liveclass" className="text-gray-700 font-medium cursor-pointer">Live Classes</Link>
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

            {/* Hero Section */}
            <header className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white overflow-hidden pb-20 pt-16 md:pt-24">
                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Bridge the Gap Between <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-white">Learning & Mastery</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands of learners mastering new skills with expert-led courses, live classes, and a vibrant community.
                    </p>

                    <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 mb-8">
                        <div className="w-full flex-1 flex items-center gap-3 px-4 h-12">
                            <Search className="w-5 h-5 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 h-full"
                            />
                        </div>
                        <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 shrink-0">
                            Search
                        </button>
                    </div>

                    <div className="flex flex-wrapjustify-center gap-3 text-sm text-blue-100 items-center justify-center">
                        <span className="opacity-70">Popular:</span>
                        {popularTags.map(tag => (
                            <button key={tag.id} onClick={() => navigate('/question-community')} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors border border-white/10">
                                {tag.tag_name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Categories Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Explore Categories</h2>
                        <p className="text-gray-600">Choose from thousands of courses in various fields</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, idx) => {
                            const IconData = ICONS[idx % ICONS.length];
                            const IconComponent = IconData.icon;
                            return (
                                <div key={category.id} onClick={() => navigate('/courses')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group flex items-start gap-4">
                                    <div className={`${IconData.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                                        <p className="text-sm text-gray-500">Explore Courses</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trending Courses Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Trending Courses</h2>
                            <p className="text-gray-600">Most popular courses this month</p>
                        </div>
                        <button onClick={() => navigate("/courses")} className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trendingCourses.map((course, idx) => (
                            <div key={course.id} onClick={() => navigate(`/courseview/${course.id}`)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-gray-100" />
                                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-md shadow-sm bg-orange-500 text-white`}>
                                        {course.level}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[3rem]">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                        <span className="flex items-center gap-1 text-orange-500">
                                            ★ {course.average_rating ? Number(course.average_rating).toFixed(1) : "0.0"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> {course.students_count || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {course.total_duration || "0m"}
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xl font-bold text-blue-600">
                                            {course.has_offer ? `₹${Number(course.final_price).toFixed(2)}` : `₹${course.original_price}`}
                                        </span>

                                        {isAuthenticated && course.is_purchased ? (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1.5 rounded-lg border border-green-100 flex items-center gap-1">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Purchased
                                            </span>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        Api.post("/student/cart/add/", { course_id: course.id })
                                                            .then(() => toast.success("Added to cart!"))
                                                            .catch((err) => toast.error(err.response?.data?.detail || "Failed to add to cart"));
                                                    }}
                                                    className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        Api.post("/student/wishlist/toggle/", { course_id: course.id })
                                                            .then(() => toast.success("Wishlist updated!"))
                                                            .catch((err) => toast.error(err.response?.data?.detail || "Failed to update wishlist"));
                                                    }}
                                                    className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Q&A Community Section */}
            <section className="py-16 bg-blue-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Latest from Q&A Community</h2>
                            <p className="text-gray-600">Get help from our community of learners and experts</p>
                        </div>
                        <button
                            onClick={() => navigate('/question-community')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        >
                            Ask Question
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {questions.map((q, idx) => (
                            <div key={q.id} onClick={() => navigate(`/question-community/${q.id}`)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-6 cursor-pointer">
                                <div className="hidden md:flex flex-col items-center gap-2 text-gray-500 min-w-[3rem]">
                                    <div className="flex flex-col items-center">
                                        <ThumbsUp className="w-5 h-5" />
                                        <span className="text-sm font-semibold">{q.likes_count || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-blue-500">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="text-sm font-semibold">{q.answers_count || 0}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">{q.title}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {q.tags && q.tags.map(tag => (
                                            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md border border-gray-200">
                                                {tag.tag_name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                            {q.user_name ? q.user_name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span>{q.user_name}</span>
                                        <span>•</span>
                                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
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
                                <li><a href="/courses" className="hover:text-blue-600 cursor-pointer">Browse Courses</a></li>
                                <li><Link to="/student/liveclass" className="hover:text-blue-600 cursor-pointer">Live Classes</Link></li>
                                <li><a href="/question-community" className="hover:text-blue-600 cursor-pointer">Q&A Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">Contact Us</a></li>
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">FAQs</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 cursor-pointer">Blog</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
                        © 2024 LearnBridge. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
