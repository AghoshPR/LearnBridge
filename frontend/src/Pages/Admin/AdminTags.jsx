import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/Store/authSlice";
import { toast } from "sonner";
import Api from "../Services/Api";

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
  Plus,
  Pencil,
  Trash,
  Search,
} from "lucide-react";

const AdminTags = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: "" });
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      await Api.post("/auth/logout/");
      toast.success("Logged out successfully 👋", {
        description: "See you again, Admin!",
        duration: 2500,
      });
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      dispatch(logout());
      navigate("/admin/login", { replace: true });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/qna/tags/");
      setTags(res.data);
    } catch (err) {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAddClick = () => {
    setFormData({ name: "" });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (tag) => {
    setSelectedTag(tag);
    setFormData({ name: tag.tag_name });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (tag) => {
    setItemToDelete(tag);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await Api.post("/qna/tags/create/", {
        tag_name: formData.name,
      });
      toast.success("Tag created successfully");
      setIsAddModalOpen(false);
      setFormData({ name: "" });
      fetchTags();
    } catch (err) {
      toast.error(err?.response?.data?.tag_name?.[0] || "Error creating tag");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !selectedTag) return;

    try {
      await Api.patch(`/qna/tags/${selectedTag.id}/update/`, {
        tag_name: formData.name,
      });

      toast.success("Tag updated successfully");
      setIsEditModalOpen(false);
      setSelectedTag(null);
      fetchTags();
    } catch (err) {
      toast.error("Error updating tag");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await Api.delete(`/qna/tags/${itemToDelete.id}/delete/`);
      toast.success("Tag deleted successfully");
      setItemToDelete(null);
      fetchTags();
    } catch (err) {
      toast.error("Error deleting tags");
    }
  };

  // Pagination Logic
  const filteredTags = tags.filter(
    (tag) =>
      tag.tag_name &&
      tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);

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
      <aside
        className={`
                w-64 bg-[#0A0B0F] border-r border-gray-800 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">
                LearnBridge
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                Admin Panel
              </p>
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
            onClick={() => navigate("/admin/qna")}
          />
          <NavItem
            icon={Tag}
            label="Tags Management"
            active
            onClick={() => navigate("/admin/tags")}
          />
          <NavItem
            icon={Percent}
            label="Offers"
            onClick={() => navigate("/admin/offers")}
          />
          <NavItem
            icon={Ticket}
            label="Coupons"
            onClick={() => navigate("/admin/coupons")}
          />
          <NavItem
            icon={Wallet}
            label="Wallet"
            onClick={() => navigate("/admin/wallet")}
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
                  <span className="text-sm font-bold text-white leading-none">
                    Admin
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">
                    Super User
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 transition-all duration-300 min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tags Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage course tags and categories
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
                className="bg-[#0A0B0F] border border-gray-800 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors placeholder-gray-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
            </div>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-sm active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} /> Add New Tag
            </button>
          </div>
        </div>

        {/* Tags List Container */}
        <div className="bg-[#0F1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Inner Header/Title for Box if needed, but usually table headers suffice. Based on image, it looks like "All Tags" header might be inside or just table. Image shows "All Tags" with an icon. */}
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <Tag className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white">All Tags</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0A0B0F]/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tag Name
                  </th>
                  <th className="hidden sm:table-cell px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {currentTags.length > 0 ? (
                  currentTags.map((tag) => (
                    <tr
                      key={tag.id}
                      className="hover:bg-gray-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        <div className="flex flex-col">
                          <span>{tag.tag_name}</span>
                          <span className="sm:hidden text-[10px] text-gray-500 mt-1">
                            Added: {new Date(tag.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-400 text-center">
                        {new Date(tag.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(tag)}
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tag)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-8 text-center text-gray-500 text-sm"
                    >
                      No tags found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-800">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${
                                          currentPage === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                        }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ------ Modals ------ */}

      {/* Add Tag Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          ></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Tag</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Tag Name
                </label>
                <input
                  type="text"
                  placeholder="Enter tag name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Create Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Tag</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Tag Name
                </label>
                <input
                  type="text"
                  placeholder="Enter tag name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#0F1014] border border-blue-500/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Update Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setItemToDelete(null)}
          ></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl border-red-500/20">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <Trash size={24} />
              <h3 className="text-xl font-bold text-white">Delete Tag</h3>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                "{itemToDelete.name}"
              </span>
              ?
              <br />
              <span className="text-red-400 text-xs mt-2 block">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusing NavItem Component from AdminDashboard/AdminUsers for consistency
const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}
    `}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-sm font-medium ${active ? "font-semibold" : ""}`}>
      {label}
    </span>
  </div>
);

export default AdminTags;
