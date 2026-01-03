import React from 'react';
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
    MoreVertical,
    Edit,
    Trash2,
    TrendingUp
} from 'lucide-react';

const TeacherCourses = () => {
    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: false },
        { icon: User, label: 'My Profile', active: false },
        { icon: BookOpen, label: 'My Courses', active: true },
        { icon: Video, label: 'Live Classes', active: false },
        { icon: MessageSquare, label: 'Q&A', active: false },
        { icon: Users, label: 'Students', active: false },
        { icon: BarChart2, label: 'Analytics', active: false },
        { icon: Wallet, label: 'Wallet', active: false },
    ];

    const courses = [
        {
            id: 1,
            title: 'Advanced React Patterns',
            category: 'Web Development',
            status: 'Published',
            students: 234,
            rating: 4.9,
            revenue: '$12,340'
        },
        {
            id: 2,
            title: 'Node.js Masterclass',
            category: 'Backend',
            status: 'Published',
            students: 189,
            rating: 4.7,
            revenue: '$9,450'
        },
        {
            id: 3,
            title: 'Full Stack Development',
            category: 'Web Development',
            status: 'Published',
            students: 312,
            rating: 4.8,
            revenue: '$15,600'
        },
        {
            id: 4,
            title: 'TypeScript Essentials',
            category: 'Programming',
            status: 'Draft',
            students: 156,
            rating: 4.6,
            revenue: '$7,800'
        }
    ];

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.active
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
                        <p className="text-slate-400">Manage your courses and lessons</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-900/20 transition-all">
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
                        className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-300 group">
                            {/* Course Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 relative p-4">
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${course.status === 'Published' ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' : 'bg-slate-500/20 text-slate-200 border border-slate-500/30'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700">
                                        {course.category}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-blue-400">
                                            <Users size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.students}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Students</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-yellow-400">
                                            <Star size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.rating}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                        <div className="flex justify-center mb-1 text-green-400">
                                            <TrendingUp size={16} />
                                        </div>
                                        <p className="text-white font-bold">{course.revenue}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Revenue</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm">
                                        <Edit size={16} />
                                        Manage
                                    </button>
                                    <button className="p-3 bg-slate-800 text-red-400 rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
                                        <Trash2 size={18} />
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

export default TeacherCourses;