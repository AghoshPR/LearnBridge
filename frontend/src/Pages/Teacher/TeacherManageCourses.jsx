import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/authSlice';
import Api from '../Services/Api';
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
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
  Menu,
  X,
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  Star,
  DollarSign,
  MonitorPlay,
  Folder,
  Upload
} from 'lucide-react';

const TeacherManageCourses = () => {

  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  // updating the lesson

  const [isUpdatingLesson, setIsUpdatingLesson] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.auth);

  const { id } = useParams();

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


  // handle the course updations

  const [course, setCourse] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);


  const [category, setCategory] = useState("")  // selected category ID
  const [categories, setCategories] = useState([]); // for the category List


  const [lessons, setLessons] = useState([]);


  // form lessons adding
  const [isUploadingLesson, setIsUploadingLesson] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);





  // Fetching the courses

  const fetchCourses = async () => {
    try {
      const res = await Api.get(`/courses/mycourses/${id}`)
      setCourse(res.data)
      setTitle(res.data.title)
      setDescription(res.data.description)
      setCategory(res.data.category)
      setLevel(res.data.level)
      setPrice(res.data.price)
      setStatus(res.data.status === "active" ? "published" : res.data.status);
      setThumbnailPreview(res.data.thumbnail_url || null)

    } catch (err) {
      toast.error("Failed to load course")
    }
  }

  // fetching categories


  const fetchCategories = async () => {

    try {

      const res = await Api.get('/courses/categories/')
      setCategories(res.data)
    } catch {
      toast.error("Failed to load categories")
    }
  }


  const fetchLessons = async () => {

    try {
      const res = await Api.get(`/courses/teacher/courses/${id}/lessons/`)
      setLessons(res.data)

    } catch {
      toast.error("Failed to load the data")
    }
  }



  useEffect(() => {
    fetchCourses()
    fetchCategories()
    fetchLessons()
  }, [id])







  const handleUpdateCourse = async () => {


    if (!title.trim()) {
      toast.error("Title is required");
      return
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!level) {
      toast.error("Please select a level");
      return;
    }

    if (!price) {
      toast.error("Price is required");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    if (Number(price) > 999999) {
      toast.error("Price cannot exceed 999,999");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('level', level);
    formData.append('price', price);
    formData.append('status', status);

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      await Api.patch(`/courses/mycourses/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Course updated successfully");


      await fetchCourses();

      setIsEditCourseOpen(false);
      setThumbnail(null);
    }
    catch (err) {

      const errorMsg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.category?.[0] ||
        err.response?.data?.detail ||
        "Failed to update course";

      toast.error(errorMsg);
    }

  }

  const handleAddLesson = async () => {

    if (!lessonTitle || !lessonDuration || !videoFile) {
      toast.error("All fields required");
      return;
    }

    const formData = new FormData()



    formData.append("title", lessonTitle);
    formData.append("duration", lessonDuration);
    formData.append("description", lessonDescription);
    formData.append("video", videoFile);

    try {

      setIsUploadingLesson(true);

      await Api.post(`/courses/teacher/courses/${id}/lessons/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      toast.success("Lesson uploaded")
      setIsAddLessonOpen(false)
      setLessonTitle("");
      setLessonDuration("");
      setLessonDescription("");
      setVideoFile(null);

      fetchLessons()

    } catch {
      toast.error("Lesson upload failed")
    } finally {
      setIsUploadingLesson(false);
    }


  }

  // for the lessson course edit

  const handleUpdateLesson = async () => {

    if (!lessonTitle || !lessonDuration) {
      toast.error("Title and Duration are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", lessonTitle);
    formData.append("description", lessonDescription);
    formData.append("duration", lessonDuration);

    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {

      setIsUpdatingLesson(true)

      await Api.put(`/courses/teacher/lessons/${selectedLesson.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }

        });

      toast.success("Lesson updated successfully");
      setIsEditLessonOpen(false);
      setLessonTitle("");
      setLessonDuration("");
      setLessonDescription("");
      setVideoFile(null);
      setSelectedLesson(null);
      fetchLessons();
    } catch {
      toast.error("Failed to update lesson");
    }

    finally {
      setIsUpdatingLesson(false)
    }

  }

  // lesson delete

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    try {
      await Api.delete(`/courses/teacher/lessons/${lessonToDelete.id}/`);
      toast.success("Lesson deleted successfully");
      setIsDeleteLessonOpen(false);
      setLessonToDelete(null);
      fetchLessons();
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  }


  // course video length

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);

        const totalSeconds = Math.floor(video.duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };

      video.src = URL.createObjectURL(file);
    });
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

      {/* Main Area */}
      <main className="flex-1 ml-64 p-8">

        {/* Top Bar */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/courses')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{course?.title}</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
                  {course?.category_name}
                </span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                  {course?.status}
                </span>
              </div>
              <p className="text-slate-400 mt-2">{course?.description}</p>
            </div>
            <button
              onClick={() => setIsEditCourseOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors"
            >
              <Edit size={16} />
              Edit Course
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Students" value={course?.students_count ?? 0} color="blue" />
          <StatCard icon={Star} label="Rating" value={course?.average_rating ?? 0} color="yellow" />
          <StatCard icon={MonitorPlay} label="Lessons" value={lessons.length} color="purple" />
          <StatCard icon={DollarSign} label="Price" value={course?.price ?? 0} color="green" />
        </div>

        {/* Course Lessons */}
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-200">Course Lessons</h2>
            <button
              type='button'
              onClick={() => setIsAddLessonOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-purple-900/20 transition-all"
            >
              <Plus size={18} />
              Add Lesson
            </button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Video size={14} className="text-slate-500" />
                      {lesson.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setLessonTitle(lesson.title);
                      setLessonDuration(lesson.duration);
                      setLessonDescription(lesson.description || "");
                      setVideoFile(null); // Clear video file since we can't pre-fill it
                      setIsEditLessonOpen(true);
                    }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setLessonToDelete(lesson);
                      setIsDeleteLessonOpen(true);
                    }}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main >

      {/* --- Modals --- */}

      {/* Edit Course Modal */}
      {
        isEditCourseOpen && (
          <Modal
            title="Edit Course"
            onClose={() => setIsEditCourseOpen(false)}
            onSave={handleUpdateCourse}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Course Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Thumbnail</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-course-thumbnail"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0]

                      if (file) {
                        setThumbnail(file)
                        setThumbnailPreview(URL.createObjectURL(file))

                      }
                    }}
                  />
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-28 h-20 object-cover rounded-lg border border-slate-700"
                      />
                    )}

                    <label
                      htmlFor="edit-course-thumbnail"
                      className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all group"
                    >
                      <Upload size={18} className="text-slate-400 group-hover:text-purple-400" />
                      <span className="text-sm text-slate-400 group-hover:text-slate-200">
                        {thumbnail ? thumbnail.name : 'Click to update thumbnail'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">


                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}

                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Level *</label>
                  <select

                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Price ($) *</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

            </div>
          </Modal>
        )
      }

      {/* Add Lesson Modal */}
      {
        isAddLessonOpen && (
          <Modal
            title="Add New Lesson"
            onClose={() => setIsAddLessonOpen(false)}
            onSave={handleAddLesson}
            saveText="Add Lesson"
            isLoading={isUploadingLesson}
            loadingText="Uploading..."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Lesson Title *</label>
                <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Enter lesson title" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select disabled className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                  <option value="video">Video</option>

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration (e.g., 15:30)</label>
                <input type="text" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} placeholder="00:00" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Lesson Video
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    setVideoFile(file);

                    const duration = await getVideoDuration(file);
                    setLessonDuration(duration);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea rows="3" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} placeholder="Enter lesson description" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>
            </div>
          </Modal>
        )
      }

      {/* Edit Lesson Modal */}
      {
        isEditLessonOpen && selectedLesson && (
          <Modal
            title="Edit Lesson"
            onClose={() => {
              setIsEditLessonOpen(false);
              setLessonTitle("");
              setLessonDuration("");
              setLessonDescription("");
              setVideoFile(null);
              setSelectedLesson(null);
            }}
            onSave={handleUpdateLesson}
            isLoading={isUpdatingLesson}
            loadingText="Updating..."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Lesson Title *</label>
                <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Enter lesson title" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select disabled className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration (e.g., 15:30)</label>
                <input type="text" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} placeholder="00:00" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Lesson Video (Leave empty to keep current)
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    setVideoFile(file);

                    if (file) {
                      const duration = await getVideoDuration(file);
                      setLessonDuration(duration);
                    }
                  }}
                />

                {videoFile && (
                  <p className="text-xs text-slate-400 mt-1">
                    Selected: {videoFile.name}
                  </p>
                )}

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea rows="3" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} placeholder="Enter lesson description" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>
            </div>
          </Modal>
        )
      }

      {/* Delete Lesson Confirmation Modal */}
      {
        isDeleteLessonOpen && (
          <Modal
            title="Delete Lesson"
            onClose={() => setIsDeleteLessonOpen(false)}
            onSave={handleDeleteLesson}
            saveText="Delete"
          >
            <div className="p-1">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{lessonToDelete?.title}</span>?
                This action cannot be undone.
              </p>
            </div>
          </Modal>
        )
      }

    </div >
  )
}

// Stats Card Helper
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: { bg: 'bg-blue-900/20', text: 'text-blue-400', border: 'border-blue-500/20' },
    yellow: { bg: 'bg-yellow-900/20', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    purple: { bg: 'bg-purple-900/20', text: 'text-purple-400', border: 'border-purple-500/20' },
    green: { bg: 'bg-green-900/20', text: 'text-green-400', border: 'border-green-500/20' },
  };
  const c = colors[color];

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-lg ${c.bg} ${c.text} ${c.border} border`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase">{label}</p>
        <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// Modal Component Helper
const Modal = ({ title, children, onClose, onSave, saveText = "Save Changes", isLoading = false, loadingText = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800 bg-slate-950/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm">
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center
              ${isLoading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-500"}
            `}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {loadingText}
              </>
            ) : (
              saveText
            )}
          </button>


        </div>
      </div>
    </div>
  )
}

export default TeacherManageCourses;