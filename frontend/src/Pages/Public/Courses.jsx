import React, { useState, useEffect } from 'react';

import Logo from '../../assets/learnbridge-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../Store/authSlice';
import {
    ShoppingCart,
    Bell,
    Menu,
    X,
    ChevronDown,
    Clock,
    Star,
    Heart,
    User
} from "lucide-react";
import Api from '../Services/Api';

const Courses = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")

    const { isAuthenticated, username } = useSelector((state) => state.auth);

    const goToCourseDetail = (id) => {
        navigate(`/courseview/${id}`);
    };

    useEffect(() => {
        Api.get("/courses/public/", {
            params: {
                search: search || undefined,
                category: selectedCategory || undefined,
            }
        })
            .then((res) => setCourses(res.data))
            .finally(() => setLoading(false))
    }, [search, selectedCategory])


    useEffect(() => {
        Api.get("/courses/categories/public/")
            .then((res) => setCategories(res.data));
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">
                    Loading courses...
                </p>
            </div>
        );
    }




    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navbar (Same as Home) */}
            <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <a href="/" className="flex items-center gap-2">
                            <img src={Logo} alt="LearnBridge Logo" className="h-8" />
                            <span className="text-xl font-bold text-gray-900">LearnBridge</span>

                        </a>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <button onClick={() => navigate("/courses")} className="hover:text-blue-600 transition-colors">Explore</button>
                            <a href="#" className="hover:text-blue-600 transition-colors">Q&A Community</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="relative group hidden md:block pl-2 border-l border-gray-200">
                            <button className="flex items-center gap-3">
                                <span className="text-sm font-medium">
                                    {isAuthenticated ? `Hi, ${username}` : "User"}
                                </span>

                                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
                                </div>
                            </button>

                            {/* Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">

                                {!isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={() => navigate("/student/login")}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => navigate("/student/register")}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50">
                                            Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                dispatch(logout());
                                                navigate("/student/login", { replace: true });
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
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
                        <div className="flex flex-col gap-3">
                            <button className="w-full px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                Sign In
                            </button>
                            <button className="w-full px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
                    <p className="text-gray-500">Discover thousands of courses across various categories</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-2 w-full md:w-2/3 lg:w-1/2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search resources"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                            />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm whitespace-nowrap">
                            Search
                        </button>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 cursor-pointer hover:border-gray-300 transition-colors">

                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option value={cat.id} key={cat.id} >{cat.name}</option>
                                ))}


                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="relative flex-1 md:flex-none">
                            <select className="w-full appearance-none bg-white border border-gray-200 text-gray-700 pl-4 pr-10 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 cursor-pointer hover:border-gray-300 transition-colors">
                                <option>Most Popular</option>
                                <option>Newest</option>
                                <option>Highest Rated</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div key={course.id}
                            onClick={() => goToCourseDetail(course.id)}
                            className="bg-white rounded-2xl border border-gray-100 cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                            <div className="relative h-40 overflow-hidden bg-gray-100">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white ${course.level === 'Intermediate' ? 'bg-orange-400' : course.level === 'Advanced' ? 'bg-orange-500' : 'bg-orange-400'}`}>
                                    {course.level}
                                </span>
                                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4 fill-transparent hover:fill-current transition-colors" />
                                </button>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 mb-1 leading-tight line-clamp-2 text-lg">{course.title}</h3>
                                <p className="text-xs font-medium text-blue-600 mb-2">{course.category}</p>
                                <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                    <span className="flex items-center gap-1 text-orange-500">
                                        <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> {course.reviews}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xl font-bold text-blue-600">₹{course.price}</span>
                                    <button className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Courses;
