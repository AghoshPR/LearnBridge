import React, { useState } from 'react';
import { toast } from "sonner";
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
    ThumbsUp,
    MessageCircle,
    X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { logout } from '../../Store/authSlice';

const TeacherQACommunity = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('unanswered');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data based on the images
    const unansweredQuestions = [
        {
            id: 1,
            title: "How to implement custom hooks in React?",
            description: "I'm trying to create a custom hook for API calls but facing issues...",
            tags: ["react", "hooks"],
            author: "John Doe",
            course: "Advanced React Patterns",
            time: "2 hours ago",
            upvotes: 12,
            comments: 0
        },
        {
            id: 2,
            title: "TypeScript generics best practices",
            description: "What are the best practices when using generics in TypeScript?",
            tags: ["typescript", "generics"],
            author: "Jane Smith",
            course: "TypeScript Essentials",
            time: "5 hours ago",
            upvotes: 8,
            comments: 0
        }
    ];

    const answeredQuestions = [
        {
            id: 3,
            title: "Difference between useEffect and useLayoutEffect?",
            description: "Can someone explain when to use each one?",
            tags: ["react", "hooks"],
            author: "Mike Johnson",
            course: "Advanced React Patterns",
            time: "1 day ago",
            upvotes: 24,
            comments: 3
        }
    ];

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
            navigate("/admin/login", { replace: true });
        }
    };

    const openAnswerModal = (question) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    const closeAnswerModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', active: false },
        { icon: User, label: 'My Profile', path: '/teacher/profile', active: false },
        { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
        { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
        { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: true },
        { icon: Users, label: 'Students', path: '/teacher/students', active: false },
        { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
        { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Mobile Sidebar Toggle - Only visible on small screens */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-slate-800 rounded-lg text-white shadow-lg"
                >
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-white ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
                            onClick={() => navigate(item.path)}
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
            <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
                <div className="max-w-6xl mx-auto mt-12 md:mt-0">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Q&A Management</h1>
                        <p className="text-slate-400">Answer student questions and engage with your community</p>
                    </header>

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder=""
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('unanswered')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'unanswered'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Unanswered ({unansweredQuestions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('answered')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'answered'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Answered ({answeredQuestions.length})
                        </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {activeTab === 'unanswered' && unansweredQuestions.map((question) => (
                            <div key={question.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                                <div className="flex gap-4">
                                    {/* Stats Column */}
                                    <div className="flex flex-col items-center gap-3 pt-1 min-w-[3rem]">
                                        <div className="flex flex-col items-center gap-1">
                                            <ThumbsUp size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.upvotes}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MessageCircle size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.comments}</span>
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{question.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{question.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>by {question.author}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.course}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.time}</span>
                                            </div>
                                            <button
                                                onClick={() => openAnswerModal(question)}
                                                className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-900/20"
                                            >
                                                Answer Question
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'answered' && answeredQuestions.map((question) => (
                            <div key={question.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-3 pt-1 min-w-[3rem]">
                                        <div className="flex flex-col items-center gap-1">
                                            <ThumbsUp size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.upvotes}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MessageCircle size={18} className="text-green-500" />
                                            <span className="text-sm font-bold text-slate-300">{question.comments}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{question.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{question.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>by {question.author}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.course}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.time}</span>
                                            </div>
                                            <button
                                                className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-900/20"
                                            >
                                                View Answers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Answer Modal */}
            {isModalOpen && selectedQuestion && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Answer Student Question</h2>
                            <button
                                onClick={closeAnswerModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">{selectedQuestion.title}</h3>
                                    <span className="px-3 py-1 bg-gray-200 rounded-md text-xs font-medium text-gray-700 whitespace-nowrap">
                                        {selectedQuestion.course}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">{selectedQuestion.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span>Asked by:</span>
                                        <span className="font-medium text-gray-900">{selectedQuestion.author}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{selectedQuestion.time}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {selectedQuestion.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Your Answer</label>
                                <textarea
                                    className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 bg-white"
                                    placeholder="Provide a clear, detailed explanation with examples if applicable"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeAnswerModal}
                                    className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success("Answer posted successfully!");
                                        closeAnswerModal();
                                    }}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold transition-colors text-sm shadow-lg shadow-blue-900/20 hover:from-blue-700 hover:to-blue-800"
                                >
                                    Post Answer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherQACommunity