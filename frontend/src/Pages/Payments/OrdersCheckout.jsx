import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Tag, CreditCard, Trash2, X, Search, ShoppingCart, Bell, Heart, User, BookOpen, LogOut, Menu, Check } from 'lucide-react';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Logo from '../../assets/learnbridge-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/authSlice';
import Api from '../Services/Api';
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";


const OrdersCheckout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [couponCode, setCouponCode] = useState('');

  // stipe

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card")



  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);


  // coupons

  const [availableCoupons,setAvailableCoupons] = useState([])
  const [selectedCouponId,setSelectedCouponId] = useState("")
  const [couponDiscount,setCouponDiscount] = useState(0)

  

  const subtotal = cartItems.reduce(
    (sum,item)=>sum+Number(item.original_price),0
  )

  const totalAfterDiscount = cartItems.reduce(
    (sum,item)=>sum+Number(item.final_price),0
  )

  const offerDiscount = subtotal - totalAfterDiscount

  //  after coupon apply
  const finalTotal = totalAfterDiscount - couponDiscount



  useEffect(() => {
    fetchCart()
    fetchCoupons()
  }, [])

  const fetchCart = async () => {

    try {
      const res = await Api.get("/cart/")
      setCartItems(res.data.items)
      setTotal(res.data.total_amount)

    } catch {
      toast.error("Failed to load checkout data")
    } finally {
      setLoading(false)
    }
  }

  const fetchCoupons = async()=>{

    try{

        const res = await Api.get("/mycoupons/")
        setAvailableCoupons(res.data)
    }catch{
      toast.error("Failed to load coupons")
    }

  }


  const handleAddAddress = (e) => {
    e.preventDefault();
    // Logic to add address would go here
    setIsAddressModalOpen(false);
  };




  const payWithStripe = async () => {

    if (!stripe || !elements) {

      toast.error("Stripe not loaded")
      return
    }



    try {
      const res = await Api.post("/createorder/",{
        coupon_id: selectedCouponId || null
      })
      const { client_secret, order_id } = res.data


      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      })

      if (result.error) {

        toast.error(result.error.message)
      } else {

        if (result.paymentIntent.status === "succeeded") {

          await Api.post("/stripe/success/", {
            payment_intent_id: result.paymentIntent.id,
          })

          
          setOrderId(order_id || result.paymentIntent.id);
          setShowSuccessModal(true);

        }
      }

    } catch (err) {
      toast.error("Payment Failed")
    }
  }

  const payWithRazorpay = async () => {

    try {
      const res = await Api.post("/razorpay/create/",{
        coupon_id: selectedCouponId || null
      })
      const data = res.data

      const options = {

        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "LearnBridge",
        description: "Course Purchase",
        order_id: data.razorpay_order_id,

        handler: async function (response) {
          await Api.post("/razorpay/verify/", {
            order_id: data.order_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
         
          setOrderId(data.order_id);
          setShowSuccessModal(true);
        },
        prefill: {
          name: username
        },
        theme: {
          color: "#2563eb",
        },
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Razorpay payment failed")
    }

  };




  const handleCheckout = async () => {

    if (paymentMethod === "card") {
      payWithStripe()
    } else {
      payWithRazorpay()
    }
  }

  const handleSelectCoupon = async(code)=>{

      if(!code){
        setCouponDiscount(0)
        setSelectedCouponId("")
        return
      }

      try{
        const res = await Api.post("/applycoupon/",{
          code: code
        })
        

        setCouponDiscount(Number(res.data.discount))
        setSelectedCouponId(code)
        
        toast.success(`${code} applied successfully 🎉`)
       
        
      }catch{
        setCouponDiscount(0)
        setSelectedCouponId("")
         toast.error(err.response?.data?.error || "Invalid Coupon")
      }
  }

  
  // const [addresses, setAddresses] = useState([
  //   {
  //     id: 1,
  //     name: 'aghoshaghu',
  //     type: 'Default',
  //     address: '123 Main Street, Apartment 4B',
  //     city: 'Mumbai',
  //     state: 'Maharashtra',
  //     zip: '400001',
  //     phone: '9876543210',
  //   },
  //   {
  //     id: 2,
  //     name: 'Tirun',
  //     type: '',
  //     address: 'Abc123, kiralur',
  //     city: 'kerala',
  //     state: '',
  //     zip: '12345',
  //     phone: '123134',
  //   },
  // ]);

  if (loading) {
    return <div className="text-center py-20">Loading checkout...</div>;
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 mb-8">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="LearnBridge Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to='/courses' className="hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/question-community" className="hover:text-blue-600 transition-colors">Q&A Community</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ShoppingCart className="w-5 h-5  cursor-pointer" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/wishlist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Heart className="w-5 h-5" />
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
                    <button onClick={() => navigate("/student/profile")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button onClick={() => navigate("/mycourse")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </button>
                    <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full">
                      <Heart className="w-4 h-4" />
                      Wishlist
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
            <Link to="/question-community" className="text-gray-700 font-medium">Q&A Community</Link>
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

      <div className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Addresses and Items */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery Address Section */}
              {/* <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Delivery Address</h2>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center gap-1 text-sm font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative flex gap-4 p-4 rounded-lg border cursor-pointer transition-all ${selectedAddress === addr.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedAddress(addr.id)}
                    >
                      <div className="mt-1">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === addr.id ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                          {selectedAddress === addr.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.name}</span>
                          {addr.type && (
                            <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium uppercase tracking-wider">
                              {addr.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {addr.address}, {addr.city}, {addr.state && `${addr.state} - `}{addr.zip}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Phone: {addr.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Order Items Section */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-lg font-semibold">Order Items ({cartItems.length})</h2>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base truncate pr-4" title={item.title}>
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Instructor: {item.instructor}</p>
                          </div>
                          <div className="text-right">
                              {item.has_offer ? (
                                <>
                                  <div className="text-xs text-gray-400 line-through">
                                    ₹{Number(item.original_price).toFixed(2)}
                                  </div>
                                  <div className="font-bold text-primary">
                                    ₹{Number(item.final_price).toFixed(2)}
                                  </div>
                                </>
                              ) : (
                                <div className="font-bold text-primary">
                                  ₹{Number(item.original_price).toFixed(2)}
                                </div>
                              )}
                          </div>
                            
                        </div>
                        {item.tag && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground border border-border w-fit px-2 py-1 rounded">
                            <Tag className="w-3 h-3" />
                            <span>{item.tag}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column - Summary & Coupons */}
            <div className="space-y-6">

              {/* Apply Coupon */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4" />
                  <h2 className="font-semibold">Apply Coupon</h2>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="ENTER COUPON CODE"
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase placeholder:normal-case"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                    Apply
                  </button>
                </div>

                <div className="relative">
                  <p className="text-xs text-muted-foreground mb-2">Or select from available coupons:</p>
                  <select

                    value={selectedCouponId || ""}
                    onChange={(e)=>handleSelectCoupon(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">

                    <option value="">Select a coupon</option>
                    
                      {availableCoupons.map((coupon)=>(
                        <option key={coupon.id} value={coupon.code}>
                          {coupon.code}
                        </option>
                      ))}

                  </select>

                  <div className="absolute right-3 top-[2.2rem] pointer-events-none">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal (1 items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-500">
                    <span>% Offer Discount</span>
                    <span>-₹ {offerDiscount.toFixed(2)}</span>
                  </div>

                   <div className="flex justify-between text-green-600 dark:text-green-500">
                    <span>% Coupon Discount</span>
                    <span>-₹ {couponDiscount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-xs text-muted-foreground space-y-1">
                <p>Revenue Distribution:</p>
                <div className="flex justify-between">
                  <span>Platform (25%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Teacher (75%):</span>
                  <span>₹0.00</span>
                </div>
              </div> */}

                {/* Payment Method */}
                <div className="mb-4 space-y-3">
                  <h3 className="font-semibold text-sm">Payment Method</h3>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <CreditCard className="w-4 h-4" />
                    Card (Stripe)
                  </label>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                    />
                    UPI (Razorpay)
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="mb-4 p-3 border rounded-lg">
                    <CardElement />
                  </div>
                )}

                <button onClick={handleCheckout} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                  Place Order
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border animate-in zoom-in-95 duration-200 p-6 relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* <h2 className="text-xl font-bold mb-6">Add New Address</h2> */}

            {/* <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address Line 1</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="House No, Building, Street Area"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Landmark, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP / Pin Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="400001"
                  />
                </div>
                <div className="space-y-2 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm">Make this my default address</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Save Address
                </button>
              </div>
            </form> */}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 relative">

            <div className="mb-6 relative">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-green-500 shadow-sm">
                  <Check className="w-8 h-8 text-green-500 stroke-[3]" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h2>

            <p className="text-gray-500 mb-4 text-sm font-medium">Your order ID is:</p>

            <div className="bg-gray-50 px-8 py-4 rounded-lg text-gray-600 font-mono text-lg mb-8 tracking-wider shadow-inner w-full max-w-xl mx-auto border border-gray-100">
              {orderId || "ORD1764937751995MFJ3BD02T"}
            </div>

            <p className="text-gray-400 mb-10 text-sm">
              You can now access it from purchased courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
              <button
                onClick={() => navigate('/mycourse')}
                className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                View My Courses
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex-1 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-[1.02]"
              >
                Explore Courses
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersCheckout