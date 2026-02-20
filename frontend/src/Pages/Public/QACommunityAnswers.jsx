import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Share2,
  MoreVertical,
  Send,
  User,
  Menu,
  X,
  ShoppingCart,
  Bell,
  LogOut,
  BookOpen,
  Heart,
  Package
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import Logo from '../../assets/learnbridge-logo.png';
import { toast } from "sonner";
import Api from '../Services/Api';

const QACommunityAnswers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]); 



  useEffect(() => {
    fetchQuestionDetail();
    fetchAnswers();
  }, [id]);

  const fetchQuestionDetail = async()=>{

      try{
        const res = await Api.get(`/qna/questions/${id}/`)
        setQuestion(res.data)
      
      }catch(err){
        toast.error("Failed to load questions")
      }
  }

  const fetchAnswers = async()=>{

      try{
        const res = await Api.get(`/qna/questions/answers/${id}/`)
        setAnswers(res.data)
      }catch(err){
        toast.error("failed to load answers")
      }
  }

  const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString(); // shows date + time
};


  const handlePostAnswer = async() => {


    if (!isAuthenticated) {
      toast.error("Login required");
      navigate("/student/login");
      return;
    }

    if (!newAnswer.trim()) return;


    try{

      await Api.post(`/qna/questions/answers/create/${id}/`, {
        body:newAnswer
      })

      toast.success("Answer posted successfully")
      setNewAnswer("");

      fetchAnswers()

    }catch(err){
      toast.error("Failed to post answer")
    }

  };

  const handlePostReply = async(answerId) => {

    if (!replyText.trim()) return;


    try{
      
      await Api.post(`/qna/answers/reply/${answerId}/`, {
        body:replyText,
      })

      toast.success("Reply posted successfully!");
      setReplyText("");
      setReplyingTo(null);
      fetchAnswers();
      

    }catch(err){
      toast.error("failed to Post reply")
    }
    

    
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar (Reused from QuestionCommunity) */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="text-blue-600 font-semibold transition-colors">Q&A Community</Link>
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

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">{isAuthenticated ? `Hi, ${username}` : "User"}</span>
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {/* Profile Dropdown */}
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
                    <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button onClick={() => {
                      dispatch(logout());
                      navigate("/student/login", { replace: true });
                      toast.success("Logged out successfully");
                    }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" /> Logout
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
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">

        {/* Back Link */}
        <Link to="/question-community" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Community
        </Link>




        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Stats Column */}
            <div className="flex flex-row sm:flex-col items-center justify-start gap-6 sm:gap-4 text-gray-400 sm:min-w-[3rem] border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-4">
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <ThumbsUp size={20} className="hover:text-blue-500 cursor-pointer transition-colors" />
                <span className="text-sm font-bold text-gray-700">{question?.votes || 0}</span>
                <span className="text-[10px] uppercase hidden sm:block">votes</span>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <MessageSquare size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">{question?.answersCount || 0}</span>
                <span className="text-[10px] uppercase hidden sm:block">answers</span>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <Eye size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">{question?.views|| 0}</span>
                <span className="text-[10px] uppercase hidden sm:block">views</span>
              </div>
            </div>




            {/* Right: Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{question?.title}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {question?.tags?.map((tag) => (
                  <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    {tag.tag_name}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200">
                  {question?.course_name}
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {question?.user_name?.charAt(0)}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-blue-600">{question?.user_name}</span>
                  <span className="text-gray-500 ml-1">asked {question?.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Answer Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Answer</h2>
          <div className="mb-4">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here... Be detailed and helpful."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-y bg-gray-50"
            ></textarea>
          </div>
          <button
            onClick={handlePostAnswer}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Send size={18} />
            Post Answer
          </button>
        </div>

        {/* Answers List */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{answers.length} Answers</h2>

          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 order-2 sm:order-1">
                    <p className="text-gray-800 mb-4 text-base leading-relaxed">
                      {answer?.body}
                    </p>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {answer.user_name .charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">{answer?.user_name}</span>
                        <span className="ml-1">answered {answer.time}</span>
                        <span>{formatDateTime(question.created_at)}</span>
                      </div>
                    </div>

                    {/* Reply Button */}
                    <button
                      onClick={() => setReplyingTo(replyingTo === answer.id ? null : answer.id)}
                      className="text-blue-600 text-sm font-medium hover:underline mb-4 inline-block"
                    >
                      Reply
                    </button>

                    {/* Reply Form */}
                    {replyingTo === answer.id && (
                      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-3 bg-white"
                          rows="3"
                        ></textarea>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePostReply(answer.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Submit Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies List */}
                    {answer.replies.length > 0 && (
                      <div className="pl-6 border-l-2 border-gray-100 space-y-4 mt-2">
                        {answer.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-800 mb-2">{reply.body}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
                                <User className="w-4 h-4" />
                              </div>
                              <div className="text-xs text-gray-500">
                                
                                <span className="font-semibold text-gray-700">{reply.user_name}</span>
                                <span className="ml-1">replied {formatDateTime(reply.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Helpful Actions */}
                  <div className="flex flex-row sm:flex-col items-center gap-4 sm:min-w-[3rem] order-1 sm:order-2 mb-2 sm:mb-0 border-b sm:border-b-0 sm:border-l border-gray-100 pb-2 sm:pb-0 sm:pl-4">
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1 group cursor-pointer">
                      <ThumbsUp size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span className="text-xs text-gray-500">helpful</span>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1 group cursor-pointer">
                      <ThumbsDown size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-xs text-gray-500 text-center leading-tight">Not helpful</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



      </main>
    </div>
  );
};

export default QACommunityAnswers;