import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/Api';
import { toast } from "sonner"

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
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Search,
  Filter,
  Layers,
  Copy
} from 'lucide-react';

const AdminOffer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const navigate = useNavigate();

  const [offers, setOffers] = useState([])
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const initialFormState = {
    title: "",
    discount_type: "percentage",
    discount_value: "",
    apply_type: "Category", // Default to Category
    course: "",
    category: "",
    start_date: "",
    end_date: "",
    max_uses: "",
    is_active: true
  }

  const [formData, setFormData] = useState(initialFormState)

  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchOffers()
    fetchCategories()
    fetchCourses()
  }, [])

  const fetchOffers = async () => {

    try {
      const res = await Api.get("/offers/")
      setOffers(res.data)

    } catch (err) {
      toast.error("Failed to load offers")
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await Api.get("/courses/admin/categories/")
      setCategories(res.data.results)
    } catch (err) { }
  }

  const fetchCourses = async () => {
    try {
      const res = await Api.get("/courses/admin/courses/")
      setCourses(res.data.results)
    } catch (err) { }
  }

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      const payload = { ...formData };



      if (payload.apply_type === "Category") {
        payload.course = null;
      } else if (payload.apply_type === "Course") {
        payload.category = null;
      }

      if (editingId) {
        await Api.put(`/offers/update/${editingId}/`, payload)
        toast.success("Offer updated successfully")
      } else {

        await Api.post("/offers/create/", payload)
        toast.success("Offer created successfully")
      }
      setIsModalOpen(false)
      setEditingId(null)
      fetchOffers()

    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;

        Object.keys(errors).forEach((key) => {
          errors[key].forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Something went wrong");
      }
    }

  }

  const handleEdit = (offer) => {
    setEditingId(offer.id)
    setFormData({
      ...offer,
      course: offer.course || "",
      category: offer.category || "",

    })
    setIsModalOpen(true)
  }

  const handleDelete = (offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!offerToDelete) return;

    try {
      await Api.delete(`/offers/delete/${offerToDelete.id}/`)
      toast.success("Offer deleted")
      fetchOffers()
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);

    } catch {
      toast.error("Delete Failed")
    }
  }

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
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon={BookOpen} label="Courses" onClick={() => navigate("/admin/courses")} />
          <NavItem icon={Folder} label="Categories" onClick={() => navigate("/admin/categories")} />
          <NavItem icon={Users} label="Users" onClick={() => navigate("/admin/users")} />
          <NavItem icon={GraduationCap} label="Teachers" onClick={() => navigate("/admin/teachers")} />
          <NavItem icon={MessageSquare} label="Q&A Moderation" onClick={() => navigate("/admin/qna")} />
          <NavItem icon={Tag} label="Tags Management" onClick={() => navigate("/admin/tags")} />
          <NavItem icon={Percent} label="Offers" active onClick={() => navigate("/admin/offers")} />
          <NavItem icon={Ticket} label="Coupons" onClick={() => navigate("/admin/coupons")} />
          <NavItem icon={Wallet} label="Wallet" onClick={() => navigate("/admin/wallet")} />

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 select-none">
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
              <button className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 transition-all duration-300">

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A0B0F] p-6 rounded-2xl border border-gray-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Offers</h1>
              <p className="text-gray-400 mt-1 text-sm">Manage discounts for courses and categories</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Add Offer</span>
            </button>
          </div>

          {/* Offers Table */}
          <div className="bg-[#0A0B0F] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              {offers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No offers found. Create one to get started.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-[#111216]">
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Discount</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Apply To</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Valid Period</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {offers.map((offer) => {

                      const categoryName = categories.find(
                        (c) => Number(c.id) === Number(offer.category)
                      )?.name;

                      const courseTitle = courses.find(
                        (c) => Number(c.id) === Number(offer.course)
                      )?.title;

                      return (
                        <tr
                          key={offer.id}
                          className="hover:bg-gray-900/50 transition"
                        >
                          <td className="p-4 font-bold">{offer.title}</td>

                          <td className="p-4">
                            {offer.discount_type === "percentage"
                              ? `${offer.discount_value}%`
                              : `₹ ${offer.discount_value}`}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs border ${offer.apply_type === "Category"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                }`}
                            >
                              {offer.apply_type === "Category"
                                ? (categoryName || "Unknown Category")
                                : (courseTitle || "Unknown Course")}
                            </span>
                          </td>

                          <td className="p-4 text-sm text-gray-400">
                            {offer.start_date} → {offer.end_date}
                          </td>

                          <td className="p-4 text-gray-400">
                            {offer.used_count} / {offer.max_uses}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs border ${offer.is_active
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                            >
                              {offer.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(offer)}
                                className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(offer)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0A0B0F] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white mb-0">{editingId ? "Edit Offer" : "Add New Offer"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Offer Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Offer Name *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  placeholder="Ex: Summer Sale"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Discount Type *</label>
                  <div className="relative">
                    <select
                      name="discount_type"
                      value={formData.discount_type}
                      onChange={handleChange}
                      className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Discount Value *</label>
                  <input
                    type="number"
                    name="discount_value"
                    value={formData.discount_value}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                    placeholder="Ex: 20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Valid From */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Valid From *</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 custom-date-input"
                  />
                </div>

                {/* Valid Till */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Valid Till *</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 custom-date-input"
                  />
                </div>
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Max Uses</label>
                <input
                  type="number"
                  name="max_uses"
                  value={formData.max_uses}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 100"
                  className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>

              {/* Apply To Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Apply Type *</label>
                <div className="relative">
                  <select
                    name="apply_type"
                    value={formData.apply_type}
                    onChange={handleChange}
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Category">Category</option>
                    <option value="Course">Course</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>

              {/* Select Category/Course */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Select {formData.apply_type} *</label>
                <div className="relative">
                  {formData.apply_type === "Category" ? (
                    <select
                      name="category"
                      value={formData.category} // Ensure null/undefined becomes ""
                      onChange={handleChange}
                      required
                      className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      name="course"
                      value={formData.course} // Ensure null/undefined becomes ""
                      onChange={handleChange}
                      required
                      className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select course...</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-gray-300">Active</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {editingId ? "Update Offer" : "Create Offer"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-[#0A0B0F] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Delete Offer</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{offerToDelete?.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

export default AdminOffer;