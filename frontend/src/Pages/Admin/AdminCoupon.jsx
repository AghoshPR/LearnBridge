/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Copy,
  Check
} from 'lucide-react';

const AdminCoupon = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock Data
  const coupons = [
    {
      id: 1,
      code: 'WELCOME10',
      discountType: 'Percentage',
      discountValue: 10,
      minOrder: 500,
      validFrom: '2024-01-01',
      validTill: '2025-12-31',
      usage: '45 / 500',
      status: 'Active'
    },
    {
      id: 2,
      code: 'FLAT200',
      discountType: 'Fixed',
      discountValue: 200,
      minOrder: 1000,
      validFrom: '2024-01-01',
      validTill: '2025-12-31',
      usage: '30 / 200',
      status: 'Active'
    },
    {
      id: 3,
      code: 'LEARN25',
      discountType: 'Percentage',
      discountValue: 25,
      minOrder: 2000,
      validFrom: '2024-01-01',
      validTill: '2025-12-31',
      usage: '12 / 100',
      status: 'Active'
    }
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          <NavItem icon={MessageSquare} label="Q&A Moderation" />
          <NavItem icon={Tag} label="Tags Management" />
          <NavItem icon={Percent} label="Offers" onClick={() => navigate("/admin/offers")} />
          <NavItem icon={Ticket} label="Coupons" active onClick={() => navigate("/admin/coupons")} />
          <NavItem icon={Wallet} label="Wallet" onClick={() => navigate("/admin/wallet")} />
          <NavItem icon={Settings} label="Settings" />
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
              <h1 className="text-2xl font-bold text-white">Coupons</h1>
              <p className="text-gray-400 mt-1 text-sm">Manage coupon codes for checkout discounts</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Add Coupon</span>
            </button>
          </div>

          {/* Coupons Table */}
          <div className="bg-[#0A0B0F] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-[#111216]">
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Discount</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Order</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Valid Period</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="group hover:bg-gray-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2">
                            {coupon.code}
                            <Copy size={12} className="cursor-pointer hover:text-blue-300" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-white">
                          {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `₹ ${coupon.discountValue}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-400 font-mono">₹{coupon.minOrder}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-gray-400">
                          <span className="block">{coupon.validFrom} to {coupon.validTill}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-400">
                          {coupon.usage}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${coupon.status === 'Active'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
        </div>
      </main>

      {/* Add/Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0A0B0F] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Coupon</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="E.G. SUMMER20"
                  className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Discount Type *</label>
                  <div className="relative">
                    <select className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
                      <option>Percentage (%)</option>
                      <option>Fixed Amount (₹)</option>
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
                    placeholder="0"
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Valid From */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Valid From *</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 custom-date-input"
                    />
                  </div>
                </div>

                {/* Valid Till */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Valid Till *</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 custom-date-input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Max Uses */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Max Uses</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  />
                </div>

                {/* Min Order Value */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-[#111216] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-gray-300">Active</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Create Coupon
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

export default AdminCoupon;