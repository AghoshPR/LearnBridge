import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    User,
    BookOpen,
    Video,
    MessageSquare,
    Users,
    BarChart2,
    Wallet,
    LogOut,
    Search,
    Plus,
    Star,
    Edit,
    Trash2,
    TrendingUp,
    Upload,
    X,
    ArrowLeft,
    Folder
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import Api from '../Services/Api';
import { toast } from "sonner";

const TeacherCourses = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { username } = useSelector((state) => state.auth);


    const [courses, setCourses] = useState([])
    const [categories, setCategories] = useState([])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('')
    const [price, setPrice] = useState('')
    const [thumbnail, setThumbnail] = useState(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);


    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const PAGE_SIZE = 10
    const [search, setSearch] = useState("")




    const handleLogout = async () => {
        try {
            await Api.post("/auth/logout/");
            toast.success("Logged out successfully 👋", {
                description: "See you again!",
                duration: 2500,
            });
        } catch (err) {
            toast.error("Logout failed", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            dispatch(logout());
            navigate("/teacher/login", { replace: true });
        }
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: false },
        { icon: User, label: 'My Profile', path: '/teacher/profile', active: false },
        { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: true },
        { icon: Folder, label: 'Categories', path: '/teacher/coursecategory', active: false },
        { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
        { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
        { icon: Users, label: 'Students', path: '/teacher/students', active: false },
        { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
        { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
    ];

    // fetch all courses

    const fetchCourses = async () => {

        try {
            const res = await Api.get('/courses/mycourses/');
            setCourses(res.data)

        } catch {
            toast.error('Failed to load courses')
        }
    }

    // fetch categores

    const fetchCategories = async () => {

        try {

            const res = await Api.get('/courses/categories/')
            setCategories(res.data)
        } catch {
            toast.error('Failed to load categories')
        }
    }

    useEffect(() => {
        fetchCourses()
        fetchCategories()
    }, [])


    // creating Courses


    const handleCreateCourse = async () => {

        //  if (!title || !description || !category || !level || !price) {
        //     toast.error("All fields are required");
        //     return;
        // }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('level', level)
        formData.append('price', price)

        if (thumbnail) {
            formData.append('thumbnail', thumbnail)
        }

        try {
            await Api.post('/courses/mycourses/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast.success("Course created successfully")
            setShowCreateModal(false)

            setTitle('');
            setDescription('');
            setCategory('');
            setLevel('');
            setPrice('');
            setThumbnail(null);

            fetchCourses()
        } catch (err) {
            toast.error('Failed to create course')
        }
    }

    const handleDelete = (course) => {
        setSelectedCourse(course);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCourse = async () => {
        try {
            await Api.delete(`/courses/mycourses/${selectedCourse.id}/`);
            toast.success('Course Deleted');
            setIsDeleteModalOpen(false);
            fetchCourses();
        } catch (err) {
            toast.error('Failed to delete course');
        }
    };








    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Teacher Portal
                    </span>
                </div>

                <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => item.path && navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${item.active
                                ? 'bg-purple-600 shadow-lg shadow-purple-900/40 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={item.active ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-purple-600/50 to-blue-600/50 hover:from-purple-500 hover:to-blue-500 transition-all group shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 select-none">
                        <div className="bg-slate-900 p-3 rounded-[10px] flex items-center justify-between group-hover:bg-slate-800 transition-colors relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 text-lg">
                                    {username ? username.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">{username || 'Teacher'}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">Instructor</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
                        <p className="text-slate-400">Manage your courses and lessons</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-900/20 transition-all"
                    >
                        <Plus size={20} />
                        Create Course
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                    />
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {courses.map((course) => (

                        <div key={course.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-300 group">
                            {/* Course Image Placeholder */}
                            <div className="h-48 relative overflow-hidden">
                                
                                {course.thumbnail_url ? (
                                <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full bg-gradient-to-br from-purple-600 to-blue-600" />
                                )}

                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold`}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700">
                                        {course.category_name}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-blue-400">
                                            <Users size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.students || 0}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Students</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-yellow-400">
                                            <Star size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.rating || 0}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-green-400">
                                            <TrendingUp size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.revenue || 0}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Revenue</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/teacher/managecourses/${course.id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer"
                                    >
                                        <Edit size={16} />
                                        Manage
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course)}
                                        className="p-3 bg-slate-800 text-red-400 rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Create Course Modal Overlay */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-6 z-10 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-2"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Courses
                                </button>
                                <h2 className="text-2xl font-bold text-white">Create New Course</h2>
                                <p className="text-slate-400 text-sm">Fill in the details to create your course</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8">

                            {/* Basic Info Section */}
                            <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Course Title <span className="text-purple-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Advanced React Patterns"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                                        />

                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Description <span className="text-purple-500">*</span>
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe what students will learn in this course..."
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Category
                                            </label>
                                            <div className="relative">

                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select category</option>

                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>


                                                {/* Custom Arrow */}
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Level
                                            </label>



                                            <div className="relative">
                                                <select
                                                    value={level}
                                                    onChange={(e) => setLevel(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none cursor-pointer">
                                                    <option value="">Select level</option>
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>

                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Price  <span className="text-purple-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="1249.99"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                                        />
                                    </div>
                                </div>

                            </section>

                            {/* Thumbnail Section */}
                            <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Course Thumbnail</h3>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="course-thumbnail"
                                    hidden
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                />

                                {/* Upload UI */}
                                <label
                                    htmlFor="course-thumbnail"
                                    className="border-2 border-dashed border-slate-700 hover:border-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group bg-slate-900"
                                >
                                    <div className="w-16 h-16 bg-slate-800 group-hover:bg-purple-600/20 rounded-full flex items-center justify-center transition-colors mb-4">
                                        <Upload className="text-slate-400 group-hover:text-purple-400" size={32} />
                                    </div>

                                    <p className="text-slate-300 font-medium mb-2">
                                        {thumbnail ? thumbnail.name : 'Click to upload or drag and drop'}
                                    </p>

                                    <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>

                                    <div className="mt-6 px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm">
                                        Select File
                                    </div>
                                </label>
                            </section>


                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-6 flex justify-start gap-4 z-10">
                            <button
                                onClick={handleCreateCourse}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all">
                                Create Course
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-8 py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Course?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">{selectedCourse.title}</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDeleteCourse}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-900/20"
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

export default TeacherCourses;