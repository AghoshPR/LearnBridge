import React, { useState, useEffect, createElement } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  BookOpen,
  Package,
  Trash2,
  ArrowLeft,
  CreditCard,
  Ticket,
} from "lucide-react";
import Logo from "../../assets/learnbridge-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Api from "../Services/Api";

const StudentCart = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  //  Fetching Cart

  const fetchCart = async () => {
    try {
      const res = await Api.get("/cart/");
      setCartItems(res.data.items);
      setTotal(res.data.total_amount);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/student/login");
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  // Remove cart item

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await Api.delete(`/cart/remove/${itemToDelete.course_id}/`);

      toast.success("Course removed from cart 🗑️");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchCart();
    } catch {
      toast.error("Failed to remove course");
    }
  };

  // Clear Cart

  const ClearCart = async () => {
    try {
      await Api.delete("/cart/clear/");
      toast.success("Cart cleared 🧹");
      fetchCart();
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.original_price || 0),
    0,
  );

  const totalAfterDiscount = cartItems.reduce(
    (sum, item) => sum + Number(item.final_price || 0),
    0,
  );

  const discount = subtotal - totalAfterDiscount;

  const handleCheckout = () => {
    const enrolledItems = cartItems.filter((item) => item.is_enrolled);

    if (enrolledItems.length > 0) {
      const titles = enrolledItems.map((item) => item.title).join(", ");
      toast.error(`Course already purchased: ${titles}`, {
        description:
          "Please remove already purchased courses from your cart to proceed.",
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      {/* Navbar (Copied from Home.jsx) */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">
                LearnBridge
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                to="/courses"
                className="hover:text-blue-600 transition-colors"
              >
                Explore
              </Link>
              <a
                href="/question-community"
                className="hover:text-blue-600 transition-colors"
              >
                Q&A Community
              </a>
              <Link
                to="/student/liveclass"
                className="hover:text-blue-600 transition-colors"
              >
                Live Classes
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/student/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600 bg-blue-50 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative"
            >
              <Bell className="w-5 h-5" />
              {/* <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 relative"
            >
              <Heart className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-sm font-medium">
                  {isAuthenticated ? `Hi, ${username}` : "User"}
                </span>

                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                {!isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/login")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <User className="w-4 h-4" />
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

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate("/student/profile")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/mycourse")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>
                    <button
                      onClick={() => navigate("/student/wishlist")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>
                    <button
                      onClick={() => navigate("/student/coupons")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full"
                    >
                      <Ticket className="w-4 h-4" />
                      Coupons
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/student/login", { replace: true });
                        toast.success("Logged out successfully 👋");
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

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-full">
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-700 font-medium text-left"
            >
              Explore
            </button>
            <a href="#" className="text-gray-700 font-medium">
              Q&A Community
            </a>
            <Link to="/student/liveclass" className="text-gray-700 font-medium">
              Live Classes
            </Link>
            <hr className="border-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {isAuthenticated ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium">
                {isAuthenticated ? username : "Guest"}
              </span>
            </div>

            {isAuthenticated && (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => navigate("/student/profile")}
                  className="text-gray-700 font-medium text-left"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/mycourse")}
                  className="text-gray-700 font-medium text-left"
                >
                  My Courses
                </button>
                <button
                  onClick={() => navigate("/student/wishlist")}
                  className="text-gray-700 font-medium text-left"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => navigate("/student/coupons")}
                  className="text-gray-700 font-medium text-left"
                >
                  Coupons
                </button>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/student/login", { replace: true });
                    toast.success("Logged out successfully 👋");
                  }}
                  className="text-red-600 font-medium text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center hover:bg-gray-50/50 transition-all duration-300 group"
                >
                  <div className="w-full md:w-80 aspect-video md:h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-inner ring-1 ring-gray-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="flex-1 w-full min-h-[100px] flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-sm text-gray-500">
                        By <span className="font-semibold text-gray-800">{item.instructor}</span>
                      </p>
                      {item.is_enrolled && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1">
                          Purchased
                        </span>
                      )}
                    </div>
                    {item.tag && (
                      <span className="inline-block self-start px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded mb-3 border border-gray-200">
                        {item.tag}
                      </span>
                    )}
                    
                    {/* Price - Mobile Only */}
                    <div className="flex items-center gap-3 md:hidden mt-2">
                      {item.has_offer ? (
                        <>
                          <span className="text-xl font-bold text-blue-600 tracking-tight">
                            ₹{item.final_price}
                          </span>
                          <span className="text-gray-400 text-sm line-through">
                            ₹{item.original_price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-blue-600 tracking-tight">
                          ₹{item.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-40 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 gap-4">
                    {/* Price - Desktop Only */}
                    <div className="hidden md:flex flex-col items-end">
                      {item.has_offer ? (
                        <div className="flex flex-col items-end">
                        <span className="text-xl font-bold text-blue-600 tracking-tight">
                          ₹{item.final_price}
                        </span>
                        <span className="text-sm text-gray-400 line-through font-medium">
                          ₹{item.original_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-blue-600 tracking-tight">
                        ₹{item.original_price}
                      </span>
                    )}
                    </div>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="group/delete flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm font-bold transition-all p-2 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={ClearCart}
              className="self-start text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 bg-white px-6 py-3 rounded-xl hover:bg-gray-50 w-full md:w-auto text-center"
            >
              Clear Cart
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-96 h-fit">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span className="flex items-center gap-1">
                    Offer Discount
                  </span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900 text-lg">
                      Total
                    </span>
                    <span className="font-bold text-blue-600 text-2xl">
                      ₹{totalAfterDiscount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mt-2">
                  <p>Revenue Distribution (estimated):</p>
                  <p>Platform (15%): ₹0</p>
                  <p>Teacher (85%): ₹0</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="w-full py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Copied from Home.jsx) */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  L
                </div>
                <span className="text-xl font-bold text-gray-900">
                  LearnBridge
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Empowering learners worldwide with quality education. Join our
                community and start your journey today.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Browse Courses
                  </a>
                </li>
                <li>
                  <Link to="/student/liveclass" className="hover:text-blue-600">
                    Live Classes
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Q&A Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
            © 2024 LearnBridge. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Remove from Cart?
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-gray-900">
                  "{itemToDelete?.title}"
                </span>{" "}
                from your cart?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCart;
