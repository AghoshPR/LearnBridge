import React, { useEffect, useState } from 'react';
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
    X,
    Edit,
    Trash2
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

    const [questions, setQuestions] = useState([]);
    const [answerText, setAnswerText] = useState("");
    const [answers, setAnswers] = useState([]);
    const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editAnswerText, setEditAnswerText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);

    const fetchAnswers = async (questionId) => {
        try {
            const res = await Api.get(`/qna/questions/answers/${questionId}/`);
            setAnswers(res.data);
        } catch (error) {
            toast.error("Failed to load answers");
        }
    };

    const handleUpdateAnswer = async (answerId) => {
        try {
            await Api.patch(`/qna/answers/${answerId}/modify/`, {
                body: editAnswerText
            });
            toast.success("Answer updated successfully");
            setEditingAnswerId(null);
            setEditAnswerText("");
            fetchAnswers(selectedQuestion.id);
        } catch (err) {
            toast.error("Failed to update answer");
        }
    };

    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;
        try {
            await Api.delete(`/qna/answers/${answerToDelete}/modify/`);
            toast.success("Answer deleted successfully");
            setIsDeleteModalOpen(false);
            setAnswerToDelete(null);
            fetchAnswers(selectedQuestion.id);
            fetchTeacherQuestions();
        } catch (err) {
            toast.error("Failed to delete answer");
        }
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPageUnanswered, setCurrentPageUnanswered] = useState(1);
    const [currentPageAnswered, setCurrentPageAnswered] = useState(1);
    const itemsPerPage = 5;

    const filteredQuestions = questions.filter(q =>
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.course?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const unansweredQuestionsFull = filteredQuestions.filter(
        q => q.answers_count === 0
    )

    const answeredQuestionsFull = filteredQuestions.filter(
        q => q.answers_count > 0
    )

    const totalPagesUnanswered = Math.ceil(unansweredQuestionsFull.length / itemsPerPage);
    const currentUnanswered = unansweredQuestionsFull.slice(
        (currentPageUnanswered - 1) * itemsPerPage,
        currentPageUnanswered * itemsPerPage
    );

    const totalPagesAnswered = Math.ceil(answeredQuestionsFull.length / itemsPerPage);
    const currentAnswered = answeredQuestionsFull.slice(
        (currentPageAnswered - 1) * itemsPerPage,
        currentPageAnswered * itemsPerPage
    );


    useEffect(() => {
        fetchTeacherQuestions()
    }, [])

    const fetchTeacherQuestions = async () => {
        try {
            const res = await Api.get("/qna/teacher/questions/");
            setQuestions(res.data);
        } catch (error) {
            console.log(error.response?.data);
            toast.error("Failed to load questions");
        }
    };


    const postAnswer = async (questionId, body) => {
        try {

            await Api.post(`/qna/teacher/answer/${questionId}/`, {
                body: body
            });

            toast.success("Answer posted")
            fetchTeacherQuestions()
            setAnswerText("")
            closeAnswerModal()

        } catch {
            toast.error("Failed to post answer")
        }
    }



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
        { icon: Video, label: 'Live Classes', path: '/teacher/liveclass', active: false },
        { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: true },
        // { icon: Users, label: 'Students', path: '/teacher/students', active: false },
        // { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
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
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPageUnanswered(1);
                                setCurrentPageAnswered(1);
                            }}
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
                            Unanswered ({unansweredQuestionsFull.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('answered')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'answered'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Answered ({answeredQuestionsFull.length})
                        </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {activeTab === 'unanswered' && currentUnanswered.map((question) => (
                            <div key={question.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                                <div className="flex gap-4">
                                    {/* Stats Column */}
                                    <div className="flex flex-col items-center gap-3 pt-1 min-w-[3rem]">
                                        <div className="flex flex-col items-center gap-1">
                                            <ThumbsUp size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.upvotes || 0}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MessageCircle size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.answers_count}</span>
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{question.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{question.body}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags && question.tags.map(tag => (
                                                <span key={tag.id || tag.tag_name || tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                                                    {tag.tag_name || tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>by {question.author}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.course}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.created_at ? new Date(question.created_at).toLocaleString() : ''}</span>
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

                        {activeTab === 'unanswered' && totalPagesUnanswered > 0 && currentUnanswered.length > 0 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    disabled={currentPageUnanswered === 1}
                                    onClick={() => setCurrentPageUnanswered(prev => Math.max(prev - 1, 1))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                >
                                    Prev
                                </button>
                                {[...Array(totalPagesUnanswered)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPageUnanswered(i + 1)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                            ${currentPageUnanswered === i + 1
                                                ? "bg-purple-600 text-white"
                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPageUnanswered === totalPagesUnanswered}
                                    onClick={() => setCurrentPageUnanswered(prev => Math.min(prev + 1, totalPagesUnanswered))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {activeTab === 'answered' && currentAnswered.map((question) => (
                            <div key={question.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-3 pt-1 min-w-[3rem]">
                                        <div className="flex flex-col items-center gap-1">
                                            <ThumbsUp size={18} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-300">{question.upvotes || 0}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MessageCircle size={18} className="text-green-500" />
                                            <span className="text-sm font-bold text-slate-300">{question.answers_count}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{question.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{question.body || question.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags && question.tags.map(tag => (
                                                <span key={tag.id || tag.tag_name || tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                                                    {tag.tag_name || tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>by {question.author}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{question.course}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{new Date(question.created_at).toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedQuestion(question);
                                                    fetchAnswers(question.id);
                                                    setIsAnswersModalOpen(true);
                                                }}
                                                className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-900/20"
                                            >
                                                View Answers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'answered' && totalPagesAnswered > 0 && currentAnswered.length > 0 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    disabled={currentPageAnswered === 1}
                                    onClick={() => setCurrentPageAnswered(prev => Math.max(prev - 1, 1))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                >
                                    Prev
                                </button>
                                {[...Array(totalPagesAnswered)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPageAnswered(i + 1)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                            ${currentPageAnswered === i + 1
                                                ? "bg-purple-600 text-white"
                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPageAnswered === totalPagesAnswered}
                                    onClick={() => setCurrentPageAnswered(prev => Math.min(prev + 1, totalPagesAnswered))}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
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

                                <p className="text-gray-600 text-sm mb-4">{selectedQuestion.body || selectedQuestion.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span>Asked by:</span>
                                        <span className="font-medium text-gray-900">{selectedQuestion.author}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{selectedQuestion.created_at ? new Date(selectedQuestion.created_at).toLocaleString() : ''}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {selectedQuestion.tags && selectedQuestion.tags.map(tag => (
                                        <span key={tag.id || tag.tag_name || tag} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                                            {tag.tag_name || tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Your Answer</label>
                                <textarea

                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}

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
                                        if (!answerText.trim()) {
                                            toast.error("Answer cannot be empty")
                                            return
                                        }

                                        postAnswer(selectedQuestion.id, answerText)
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

            {/* View Answers Modal */}
            {isAnswersModalOpen && selectedQuestion && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Answers to: {selectedQuestion.title}</h2>
                            <button onClick={() => { setIsAnswersModalOpen(false); setSelectedQuestion(null); setEditingAnswerId(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {answers.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No answers yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {answers.map((answer) => (
                                        <div key={answer.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                        {answer.user_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-sm">{answer.user_name}</span>
                                                        <div className="text-xs text-gray-500">{new Date(answer.created_at).toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                {answer.user_name === username && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingAnswerId(answer.id);
                                                                setEditAnswerText(answer.body);
                                                            }}
                                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Answer"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAnswerToDelete(answer.id);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Answer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {editingAnswerId === answer.id ? (
                                                <div className="mt-4">
                                                    <textarea
                                                        value={editAnswerText}
                                                        onChange={(e) => setEditAnswerText(e.target.value)}
                                                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                                    ></textarea>
                                                    <div className="flex justify-end gap-2 mt-3">
                                                        <button
                                                            onClick={() => setEditingAnswerId(null)}
                                                            className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateAnswer(answer.id)}
                                                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{answer.body}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this answer? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setAnswerToDelete(null);
                                }}
                                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAnswer}
                                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherQACommunity