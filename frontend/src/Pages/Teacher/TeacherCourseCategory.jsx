import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/authSlice';
import Api from '../Services/Api';
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
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Folder,
  X,
} from 'lucide-react';

const TeacherCourseCategory = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([])
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.auth);

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
    { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', active: false },
    { icon: Folder, label: 'Categories', path: '/teacher/categories', active: true },
    { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', active: false },
    { icon: MessageSquare, label: 'Q&A', path: '/teacher/qa', active: false },
    { icon: Users, label: 'Students', path: '/teacher/students', active: false },
    { icon: BarChart2, label: 'Analytics', path: '/teacher/analytics', active: false },
    { icon: Wallet, label: 'Wallet', path: '/teacher/wallet', active: false },
  ];


  const fetchCategories =async()=>{

      try{
        setLoading(true)
        const res = await Api.get('/courses/categories/')
        setCategories(res.data)
      }catch{
        toast.error('Failed to load categories')
      }finally{
        setLoading(false)
      }   

  }

  useEffect(()=>{
    fetchCategories()
  },[])

  const filteredCategories = categories.filter((category) =>
  category.name.toLowerCase().includes(searchTerm.toLowerCase())
)


  
  
  const handleCreateCategory  = async()=>{

    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }

      try{
        await Api.post('/courses/categories/',{
          name,
          description,
        })
        toast.success('Category Created')
        setIsAddModalOpen(false)
        setName('')
        setDescription('')
        fetchCategories()

      }catch(err){
        toast.error(err.response?.data?.detail || 'Failed to create category')
      }


  }

  const handleEdit = (category) => {
  setSelectedCategory(category)
  setName(category.name)
  setDescription(category.description)
  setIsEditModalOpen(true)
}

  const handleUpdateCategory  = async() => {
    
      try{
        await Api.patch(`/courses/categories/${selectedCategory.id}/`,{
          name,
          description
        })
        toast.success('Category Updated')
        setIsEditModalOpen(false)
        fetchCategories()
      }catch{
        toast.error('Update Failed')
      }

  };


  // Category block/unblock

  const blockCategory = async (id) => {
      try {
        await Api.post(`/courses/categories/block/${id}/`);

        setCategories(prev =>
          prev.map(cat =>
            cat.id === id ? { ...cat, status: 'blocked' } : cat
          )
        );

        toast.success("Category blocked successfully");
      } catch (err) {
        toast.error(err.response?.data?.error || "Block failed");
      }
    };

  const unblockCategory = async (id) => {
      try {
        await Api.post(`/courses/categories/unblock/${id}/`);

        setCategories(prev =>
          prev.map(cat =>
            cat.id === id ? { ...cat, status: 'active' } : cat
          )
        );

        toast.success("Category unblocked successfully");
      } catch (err) {
        toast.error(err.response?.data?.error || "Unblock failed");
      }
    };

    

  const handleDelete=(category)=>{
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }



  const handleDeleteCategory  = async() => {

      try{
        await Api.delete(`/courses/categories/${selectedCategory.id}/`)
        toast.success('Category Deleted')
        setIsDeleteModalOpen(false)
        fetchCategories()

      }catch{
        toast.error('Cannot delete category with courses')
      }


  };


  const handleConfirmBlockToggle = async () => {
    if (!selectedCategory) return;

    if (selectedCategory.status === 'blocked') {
      await unblockCategory(selectedCategory.id);
    } else {
      await blockCategory(selectedCategory.id);
    }

    setIsBlockModalOpen(false);
    setSelectedCategory(null);
  };












  const handleBlock = (category) => {
    setSelectedCategory(category);
    setIsBlockModalOpen(true);
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
            <h1 className="text-3xl font-bold text-white mb-2">Course Categories</h1>
            <p className="text-slate-400">View and manage course categories</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-purple-900/20 transition-all"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Categories Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Category Name</th>
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Courses</th>
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Created By</th>
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 text-sm font-bold text-white">{category.name}</td>
                    <td className="p-4 text-sm text-slate-400 max-w-xs truncate">{category.description}</td>
                    <td className="p-4 text-sm text-slate-300 text-center">{category.courses}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium border border-blue-500/20">
                        {category.createdBy}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${category.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={()=>{
                            setSelectedCategory(category);
                            setIsBlockModalOpen(true);
                          }}    
                          className={`p-1.5 rounded-lg transition-colors ${category.status === 'blocked' ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'
                            }`}
                          title={category.status === 'blocked' ? 'Unlock' : 'Lock'}
                        >
                          {category.status === 'blocked' ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>


                        <button
                          onClick={() => handleDelete(category)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">


            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add Category</h3>
              <button onClick={() => setIsAddModalOpen(false)}  className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20 text-sm"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">


            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Edit Category</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>


            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={selectedCategory.name}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={selectedCategory.description}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                ></textarea>
              </div>

            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Category?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{selectedCategory.name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteCategory}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-900/20"
                  >
                    Delete
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation Modal */}
      {isBlockModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedCategory.status === 'blocked'
                ? 'bg-green-500/10 text-green-500' // Unblocking color
                : 'bg-yellow-500/10 text-yellow-500' // Blocking color
                }`}>
                {selectedCategory.status === 'blocked' ? <Unlock size={24} /> : <Lock size={24} />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {selectedCategory.status === 'blocked' ? 'Unblock Category?' : 'Block Category?'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to {selectedCategory.status === 'blocked' ? 'unblock' : 'block'} <span className="text-white font-medium">{selectedCategory.name}</span>?
                {selectedCategory.status !== 'blocked' && " Students won't be able to access courses in this category."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancel
                </button>


                <button
                  onClick={handleConfirmBlockToggle}
                  className={`px-4 py-2 text-white rounded-lg font-bold transition-colors text-sm shadow-lg ${
                    selectedCategory.status === 'blocked'
                      ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20'
                      : 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20'
                  }`}
                >
                  {selectedCategory.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TeacherCourseCategory