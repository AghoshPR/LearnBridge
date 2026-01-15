import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/Store/authSlice';
import { toast } from "sonner";
import {
  LayoutDashboard,
  BookOpen,
  Folder,
  Users,
  GraduationCap,
  MessageSquare,
  Tag,
  Percent,
  Ticket,
  Wallet,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Search,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';
import Api from '../Services/Api';

const AdminCategories = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const [categories, setCategories] = useState([])

  const fetchCategories = async()=>{

    try{
        const res = await Api.get('/courses/admin/categories/')

        setCategories(res.data)
    }catch(err){
      toast.error("Failed to load categories")
    }
  }

  useEffect(()=>{
    fetchCategories()
  },[])

  // block and unblock

  const toggleCategoriesStatus = async(id)=>{

      try{
          await Api.post(`/courses/admin/categories/toggle/${id}/`)
          toast.success('Category status updated')
          fetchCategories()
      }catch{
          toast.error("Action Failed")
      }
  }

  const deleteCategory =async()=>{

      try{
          await Api.delete(`/courses/admin/categories/${id}/`)
          toast.success("Category deleted")
          fetchCategories()
      }catch{
        toast.error("Delete failed")
      }
  }
   

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      await Api.post("/auth/logout/");
      toast.success("Logged out successfully 👋", {
        description: "See you again, Admin!",
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

  const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
      `}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-gray-100">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0B0F] border-b border-gray-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-bold text-white text-base">LearnBridge</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
                w-64 bg-[#0A0B0F] border-r border-gray-800 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">LearnBridge</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={() => navigate("/admin/dashboard")}
          />

          <NavItem
            icon={BookOpen}
            label="Courses"
            onClick={() => navigate("/admin/courses")}
          />

          <NavItem
            icon={Folder}
            label="Categories"
            active
            onClick={() => navigate("/admin/categories")}
          />

          <NavItem
            icon={Users}
            label="Users"
            onClick={() => navigate("/admin/users")}
          />

          <NavItem
            icon={GraduationCap}
            label="Teachers"
            onClick={() => navigate("/admin/teachers")}
          />

          <NavItem
            icon={MessageSquare}
            label="Q&A Moderation"
          // onClick={() => navigate("/admin/qna")}
          />

          <NavItem
            icon={Tag}
            label="Tags Management"
          // onClick={() => navigate("/admin/tags")}
          />

          <NavItem
            icon={Percent}
            label="Offers"
          // onClick={() => navigate("/admin/offers")}
          />

          <NavItem
            icon={Ticket}
            label="Coupons"
          // onClick={() => navigate("/admin/coupons")}
          />

          <NavItem
            icon={Wallet}
            label="Wallet"
          // onClick={() => navigate("/admin/wallet")}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 select-none cursor-pointer">
            <div className="bg-[#0A0B0F] p-3 rounded-[10px] flex items-center justify-between group-hover:bg-[#13151b] transition-colors relative">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-none">Admin</span>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">Super User</span>
                </div>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-6 md:p-10 pt-20 lg:pt-10 transition-all duration-300">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white">Course Categories</h1>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm">
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full">
            <div className="relative bg-[#1A1D24] rounded-lg border border-gray-800 h-12 w-full hidden">
              {/* Placeholder for visual consistency if needed */}
            </div>
          </div>
          <div className="relative bg-[#0F1014] rounded-xl border border-gray-800 focus-within:border-blue-500/50 transition-colors w-full mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full bg-transparent text-gray-200 py-3.5 pl-12 pr-4 outline-none placeholder-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-[#0F1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0A0B0F]/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/5">Category Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{category.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{category.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{category.courses}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {category.createdBy}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${category.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/10'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button
                        onClick={()=>toggleCategoriesStatus(category.id)}
                        className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                          {category.status === 'blocked' ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                        <button 
                        onClick={deleteCategory}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
    </div>
  );
};

export default AdminCategories;