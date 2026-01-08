import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from "sonner";
import { logout } from '@/Store/authSlice';
import { useDispatch } from 'react-redux';

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
  Search,
  Plus,
  MoreVertical,
  Ban,
  CheckCircle,
  Trash,
  Pencil
} from 'lucide-react';
import Api from '../Services/Api';

const AdminUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [deleteModalUser, setDeleteModalUser] = useState(null); // Contains user obj if modal open
  const navigate = useNavigate()
  const dispatch = useDispatch();


  // add user admin
  const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});




  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);



  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {

    try {
      const res = await Api.get("/admin/users/")
      setUsers(
        res.data.map((u) => ({
          id: u.id,
          name: u.username,
          email: u.email,
          joinDate: new Date(u.date_joined).toLocaleTimeString(),
          status: u.is_active ? "Active" : "Blocked"
        }))
      )
    } catch (err) {
      console.log("Fetch users failed", err);

    }

  }





  // Delete User
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

//  block and unblock user

  const blockUser = async (user) => {

    try {
      await Api.patch(`/admin/users/${user.id}/block/`)
      toast.success("User blocked Successfully")

      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: "Blocked" } : u
      ))

    } catch (err) {
      toast.error("Failed to block user")
      console.log(err)
    }

  }


  const unblockUser = async (user) => {

    try {
      await Api.patch(`/admin/users/${user.id}/unblock/`)
      toast.success("User unblocked successfully");

      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: "Active" } : u
      ))


    } catch (err) {
      toast.error("Failed to unblock user");
      console.error(err);
    }
  }

  //  block and unblock user


  // add user


  const handleAddUser =async(e)=>{

      e.preventDefault()

      const { username, email, password, confirmPassword } = formData;

      if (!username || !email || !password || !confirmPassword) {
        toast.error("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try{
        await Api.post("/admin/users/create/",{
          username,
          email,
          password
        })

        toast.success("User created successfully")
        setIsAddUserModalOpen(false)
        fetchUsers()

        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });


      }catch (err) {
        const message =
          err.response?.data?.email?.[0] ||
          err.response?.data?.password?.[0] ||
          err.response?.data?.error ||
          "Failed to create user";

        toast.error(message);
  }

  }

  // add user






  // Filter users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockToggle = (user) => {
    setDeleteModalUser(user);
  };

  const confirmBlockAction = async () => {

    if (!deleteModalUser) return

    if (deleteModalUser.status === "Active") {
      await blockUser(deleteModalUser)
    } else {
      await unblockUser(deleteModalUser)
    }
    setDeleteModalUser(null)
  };

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
          // onClick={() => navigate("/admin/courses")}
          />

          <NavItem
            icon={Folder}
            label="Categories"
          // onClick={() => navigate("/admin/categories")}
          />

          <NavItem
            icon={Users}
            label="Users"
            active
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
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 text-sm mt-1">Manage and monitor all platform users</p>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 text-sm active:scale-95"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative bg-[#0F1014] rounded-xl border border-gray-800 focus-within:border-blue-500/50 transition-colors w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-transparent text-gray-200 py-3.5 pl-12 pr-4 outline-none placeholder-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0F1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Join Date</th>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Courses</th>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-3 py-3 text-sm font-medium text-white">{user.name}</td>
                    <td className="px-3 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-3 py-3 text-sm text-gray-400">{user.joinDate}</td>
                    <td className="px-3 py-3 text-sm text-gray-400 pl-8">{user.courses}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.status === 'Active'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {user.status === 'Active' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleBlockToggle(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Ban size={14} /> Block
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Trash size={14} /> Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleBlockToggle(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <CheckCircle size={14} /> Unblock
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Trash size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 text-sm">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>


      {/* ------ Components for Modals ------ */}

      {/* Block/Unblock Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalUser(null)}></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              {deleteModalUser.status === 'Active' ? 'Block User' : 'Unblock User'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to {deleteModalUser.status === 'Active' ? 'block' : 'unblock'} <span className="text-white font-medium">"{deleteModalUser.name}"</span>?
              {deleteModalUser.status === 'Active' ? ' They will not be able to access the platform.' : ' They will regain access to the platform.'}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
              >
                No
              </button>
              <button
                onClick={confirmBlockAction}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-lg ${deleteModalUser.status === 'Active'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                  : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                  }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUserToDelete(null)}></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-md p-6 relative z-10 shadow-2xl border-red-500/20">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <Trash size={24} />
              <h3 className="text-xl font-bold text-white">Delete User</h3>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{userToDelete.name}"</span>?
              <br />
              <span className="text-red-400 text-xs mt-2 block">This action cannot be undone.</span>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="bg-[#181a20] rounded-2xl border border-gray-700 w-full max-w-lg p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAddUser}>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Name</label>
                <input type="text"
                  placeholder="Enter user name"
                  value={formData.username}
                  onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                  } 
                  className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                <input  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  } className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
                <input type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  } className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />

              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                <input  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  } className="w-full bg-[#0F1014] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600" />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Add User
                </button>
              </div>
            </form>
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

export default AdminUsers;