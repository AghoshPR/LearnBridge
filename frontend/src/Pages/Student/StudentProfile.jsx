import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/authSlice';
import { toast } from "sonner";

import {
  User,
  BookOpen,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  X,
  Upload,
  ShoppingCart,
  Bell,
  Heart,
  Package,
  Menu
} from 'lucide-react';
import Logo from '../../assets/learnbridge-logo.png';
import Api from '../Services/Api';


const StudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  

  // Data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    avatar: null
  });


  useEffect(()=>{
    fetchProfile()
  },[])

  
  const fetchProfile=async()=>{

        try{

            const res = await Api.get("/student/profile/")
            setProfileData({
                username:res.data.username,
                email:res.data.email,
                phone: res.data.phone || "",
                address: res.data.address || "",
                avatar: res.data.profile_image || null,

            })

        }catch(err){    

            toast.error("Failed to load profile")

        }finally{
            setLoading(false)
        }
  }


//   Save Profile

  const handleSave = async ()=>{

    try{

        const formData = new FormData()

        formData.append("phone", profileData.phone);
        formData.append("address", profileData.address);

        if (selectedImage) {
          formData.append("profile_image", selectedImage);
        }

       await Api.patch("/student/profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
        setSelectedImage(null);
        setPreviewImage(null);

        fetchProfile();

    }catch(err){
        toast.error("Update failed")
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  const stats = [
    { label: 'Enrolled Courses', value: '12', color: 'text-blue-600' },
    { label: 'Completed', value: '8', color: 'text-green-600' },
    { label: 'In Progress', value: '4', color: 'text-orange-500' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">

              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>

              <a href="#" className="hover:text-blue-600 transition-colors">Q&A Community</a>
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


                {/* Not Logged In */}

                {!isAuthenticated && (

                  <>
                    <button
                      onClick={() => navigate("/student/login")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <User className='w-4 h-4' />
                      Login

                    </button>

                    <button
                      onClick={() => navigate("/student/register")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" />
                      Sign Up
                    </button>


                  </>
                )}


                {/*  LOGGED IN */}


                {isAuthenticated && (
                  <>
                    <button onClick={()=>navigate("student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                      <User className="w-4 h-4 cursor-pointer" />
                      Profile
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Package className="w-4 h-4" />
                      Orders
                    </button>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/student/login", { replace: true });
                        toast.success("Logged out successfully 👋", {
                          description: "See you again!",
                          duration: 2500,
                        });
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 cursor-pointer" />
                      Logout
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
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <button onClick={() => navigate("/courses")} className="text-gray-700 font-medium">Explore</button>
            <a href="#" className="text-gray-700 font-medium">Q&A Community</a>
            <a href="#" className="text-gray-700 font-medium">Live Classes</a>
            <hr className="border-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">{isAuthenticated ? username : "Guest"}</span>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-500">Manage your personal information</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">

            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                {previewImage || profileData.avatar ? (
                  <img
                    src={previewImage || profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {profileData.username?.charAt(0)?.toUpperCase()}
                  </span>
                )}

              </div>
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                  <User size={16} />
                  Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                  {profileData.username}
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                  <Mail size={16} />
                  Email
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                  {profileData.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                  <Phone size={16} />
                  Phone Number
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-400 font-normal italic">
                  {profileData.phone || 'Enter phone number'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                  <MapPin size={16} />
                  Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-400 font-normal italic">
                  {profileData.address || 'Enter address'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-40">
              <h3 className="text-gray-700 font-bold text-lg mb-2">{stat.label}</h3>
              <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </main>


      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animation-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit size={20} className="text-blue-600" />
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-gray-400 group-hover:text-blue-500" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg">
                    <Upload size={14} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500">Click to upload new photo</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-700 text-sm font-semibold">Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;